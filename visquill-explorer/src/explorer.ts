// Self-hosted fonts as on visquill.com (no Google Fonts CDN)
import '@fontsource-variable/fraunces'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './vq-tokens.css'
import './explorer.css'
import './prism-vq.css'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import {PackageConfig, PACKAGES} from "./packages.ts";
import {VisQuill} from "@visquill/visquill-gdk";

interface DemoFile {
  name: string
  category: string
  group?: string
  description?: string
  folderPath: string
  tsFiles: Array<{
    path: string
    content: string
    fileName: string
  }>
  cssFile?: {
    path: string
    content: string
    fileName: string
  }
  scssFile?: {
    path: string
    content: string
    fileName: string
  }
  mdFile?: {
    path: string
    html: string
    fileName: string
  }
  slug: string
  hasDemoTs: boolean
}

interface DemoManifest {
  demos: DemoFile[]
  categories: string[]
  generatedAt: string
}

// DOM elements
const list = document.getElementById('demo-list')!
const title = document.getElementById('title')!
const category = document.getElementById('category')!
const homeButton = document.getElementById('home-button')!
const viewer = document.querySelector<HTMLElement>('.demo-viewer')!
const sidebarToggle = document.getElementById('sidebar-toggle')!
const sidebarBackdrop = document.getElementById('sidebar-backdrop')!

// Panels
const previewPanel = document.getElementById('preview-panel')!
const sourcePanel = document.getElementById('source-panel')!
const bothPanel = document.getElementById('both-panel')!

// Resizer
const resizer = document.getElementById('resizer')!

// Preview stages
const previewStage = document.getElementById('preview-stage')!
const bothStage = document.getElementById('both-stage')!

// Source components (two instances - one for source mode, one for both mode)
const fileTabsSource = document.getElementById('file-tabs-source')!
const sourceContainerSource = document.getElementById('source-container-source')!
const fileTabsBoth = document.getElementById('file-tabs-both')!
const sourceContainerBoth = document.getElementById('source-container-both')!

// State
let currentDemo: DemoFile | null = null
let currentDemoModules = new Map<string, any>()
let activeTab = 'both'
let activeFileTabIndex = 0
let currentStyleId: string | null = null

const loadedPackages = new Map<string, DemoManifest>()
const packageElements = new Map<string, HTMLElement>()

/**
 * Sort categories according to provided category order
 */
function sortCategories(categories: string[], categoryOrder: string[]): string[] {
  return categories.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a)
    const indexB = categoryOrder.indexOf(b)
    if (indexA !== -1 && indexB !== -1) return indexA - indexB
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    return a.localeCompare(b)
  })
}

/**
 * Build the content for a loaded package
 */
function buildPackageContent(pkg: PackageConfig, manifest: DemoManifest) {
  const packageContent = packageElements.get(pkg.name)
  if (!packageContent) return

  packageContent.innerHTML = ''

  const categoryMap = new Map<string, DemoFile[]>()

  manifest.demos.forEach(demo => {
    if (!categoryMap.has(demo.category)) {
      categoryMap.set(demo.category, [])
    }
    categoryMap.get(demo.category)!.push(demo)
  })

  const sortedCategories = sortCategories(manifest.categories, pkg.categoryOrder)

  sortedCategories.forEach((categoryName, categoryIndex) => {
    const demos = categoryMap.get(categoryName) || []

    const wrapper = document.createElement('div')
    wrapper.className = categoryIndex === 0 ? 'demo-category expanded' : 'demo-category'

    const titleDiv = document.createElement('div')
    titleDiv.className = 'demo-category-title'
    titleDiv.textContent = `${categoryName} (${demos.length})`
    titleDiv.onclick = () => {
      wrapper.classList.toggle('expanded')
    }

    const itemsDiv = document.createElement('div')
    itemsDiv.className = 'demo-category-list'

    let lastGroup: string | undefined = undefined

    demos.forEach(demo => {
      if (demo.group !== lastGroup) {
        lastGroup = demo.group
        if (demo.group) {
          const groupLabel = document.createElement('div')
          groupLabel.className = 'demo-group-label'
          groupLabel.textContent = demo.group
          itemsDiv.appendChild(groupLabel)
        }
      }

      const item = document.createElement('div')
      item.className = 'demo-item'
      item.textContent = demo.name
      item.dataset.link = `${pkg.folder}/${demo.slug}`
      item.onclick = async () => {
        document.querySelectorAll('.demo-item').forEach(i => i.classList.remove('active'))
        item.classList.add('active')
        setSidebarOpen(false)
        setDeepLink(item.dataset.link!)
        await loadDemo(demo, pkg.folder)
      }
      itemsDiv.appendChild(item)
    })

    wrapper.appendChild(titleDiv)
    wrapper.appendChild(itemsDiv)
    packageContent.appendChild(wrapper)
  })

}

/**
 * Deep links: `#<package folder>/<demo folder>`, e.g. `#concepts/geometry/polylines-02-closest-point`.
 * Replaces the hash without a history entry; null goes back to the home screen URL.
 */
function setDeepLink(link: string | null) {
  history.replaceState(null, '', link ? `#${link}` : location.pathname + location.search)
}

/**
 * Open the demo the URL hash points to. Returns false if there is none or it is unknown.
 */
async function openDeepLink(): Promise<boolean> {
  const link = decodeURIComponent(location.hash.slice(1))
  const pkg = PACKAGES.find(p => !p.isHome && link.startsWith(`${p.folder}/`))
  if (!pkg) return false

  await loadPackage(pkg)
  const demo = loadedPackages.get(pkg.name)?.demos.find(d => `${pkg.folder}/${d.slug}` === link)
  if (!demo) return false

  const content = packageElements.get(pkg.name)
  content?.parentElement?.classList.add('expanded')
  document.querySelectorAll('.demo-item').forEach(i => i.classList.remove('active'))
  const item = content?.querySelector<HTMLElement>(`.demo-item[data-link="${CSS.escape(link)}"]`)
  item?.classList.add('active')
  item?.closest('.demo-category')?.classList.add('expanded')
  item?.scrollIntoView({ block: 'nearest' })

  await loadDemo(demo, pkg.folder)
  return true
}

/**
 * Load and display a demo
 */
async function loadDemo(demo: DemoFile, folder: string) {
  currentDemo = demo

  title.textContent = demo.name
  category.textContent = demo.category
  activeFileTabIndex = 0

  const files: { name: string; content: string; language: string; isMarkdown?: boolean }[] = []

  if (demo.mdFile) {
    files.push({
      name: demo.mdFile.fileName,
      content: demo.mdFile.html,
      language: 'markdown',
      isMarkdown: true
    })
  }

  demo.tsFiles.forEach(tsFile => {
    files.push({
      name: tsFile.fileName,
      content: tsFile.content,
      language: 'typescript'
    })
  })

  if (demo.cssFile) {
    files.push({
      name: demo.cssFile.fileName,
      content: demo.cssFile.content,
      language: 'css'
    })
  }

  if (demo.scssFile) {
    files.push({
      name: demo.scssFile.fileName,
      content: demo.scssFile.content,
      language: 'css'
    })
  }

  createFileTabs(fileTabsSource, sourceContainerSource, files)
  createFileTabs(fileTabsBoth, sourceContainerBoth, files)

  await runDemo(demo, folder)
}

/**
 * Dispose the canvases of the previous demo. In a build, the demos use the GDK from the shared
 * chunk (shared/visquill-gdk.js), not the explorer's own copy, so dispose through that one too.
 */
async function disposeDemos() {
  VisQuill.disposeAll()
  if (!import.meta.env.DEV) {
    const gdk = await import(/* @vite-ignore */ `${import.meta.env.BASE_URL}shared/visquill-gdk.js`)
    gdk.VisQuill.disposeAll()
  }
}

/**
 * Dynamically import and execute the demo
 */
async function runDemo(demo: DemoFile, folder: string) {
  await disposeDemos()
  try {
    previewStage.innerHTML = ''
    bothStage.innerHTML = ''
    currentDemoModules.clear()

    // Load all TypeScript modules
    for (const tsFile of demo.tsFiles) {
      let modulePath = import.meta.env.DEV
          ? tsFile.path
          : tsFile.path.replace(/\.ts$/, '.js')

      modulePath = folder + modulePath

      if (!modulePath.startsWith('http') && !modulePath.startsWith(import.meta.env.BASE_URL)) {
        modulePath = import.meta.env.BASE_URL + modulePath
      }

      const module = await import(/* @vite-ignore */ modulePath)
      currentDemoModules.set(tsFile.fileName, module)
    }

    // Inject CSS — remove the previous demo's style first
    injectCSS(demo.slug, demo.cssFile?.content ?? demo.scssFile?.content ?? null)

    // Find run method — prefer demo.ts, fall back to first module with run()
    let runMethod = null

    if (demo.hasDemoTs) {
      const demoModule = currentDemoModules.get('demo.ts')
      if (demoModule && typeof demoModule.run === 'function') {
        runMethod = demoModule.run
      }
    }

    if (!runMethod) {
      for (const [, module] of currentDemoModules) {
        if (typeof module.run === 'function') {
          runMethod = module.run
          break
        }
      }
    }

    if (runMethod) {
      if (activeTab === 'preview') {
        runMethod(previewStage)
      } else if (activeTab === 'both') {
        runMethod(bothStage)
      }
    } else {
      console.warn('No run method found in any module')
    }
  } catch (error) {
    const message = `<div style="padding: 20px; color: #e53e3e;">Failed to load demo: ${error}</div>`
    previewStage.innerHTML = message
    bothStage.innerHTML = message
    console.error('Failed to run demo:', error)
  }
}

/**
 * Inject CSS for the current demo, removing the previous demo's styles.
 */
function injectCSS(slug: string, cssContent: string | null | undefined) {
  // Remove the previous demo's style tag
  if (currentStyleId) {
    document.getElementById(currentStyleId)?.remove()
    currentStyleId = null
  }

  if (!cssContent) return

  const styleId = `demo-style-${slug}`
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = cssContent
  document.head.appendChild(style)
  currentStyleId = styleId
}

/**
 * Create file tabs and source displays
 */
function createFileTabs(
    tabsContainer: HTMLElement,
    sourceContainer: HTMLElement,
    files: { name: string; content: string; language: string; isMarkdown?: boolean }[]
) {
  tabsContainer.innerHTML = ''
  sourceContainer.innerHTML = ''

  if (files.length === 0) return

  const copyIconSVG = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/>
    <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/>
  </svg>`
  const checkIconSVG = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
  </svg>`

  files.forEach((file, index) => {
    const tab = document.createElement('button')
    tab.className = 'file-tab' + (index === activeFileTabIndex ? ' active' : '')
    tab.textContent = file.name
    tab.onclick = () => {
      activeFileTabIndex = index
      syncFileTabSelection()
    }
    tabsContainer.appendChild(tab)

    const sourceFile = document.createElement('div')
    sourceFile.className = 'source-file' + (index === activeFileTabIndex ? ' active' : '')

    if (file.isMarkdown) {
      sourceFile.className += ' markdown-content'
      sourceFile.innerHTML = file.content
    } else {
      sourceFile.className += ' code'
      const pre = document.createElement('pre')
      pre.className = 'code-block'
      const code = document.createElement('code')
      code.className = `language-${file.language}`
      code.textContent = file.content
      pre.appendChild(code)
      sourceFile.appendChild(pre)
      Prism.highlightElement(code)
    }

    sourceContainer.appendChild(sourceFile)
  })

  // Single copy button pinned to the right, always copies the active file
  if (files.length > 0) {
    const copyBtn = document.createElement('button')
    copyBtn.className = 'file-tab-copy'
    copyBtn.title = 'Copy file contents'
    copyBtn.innerHTML = copyIconSVG
    copyBtn.onclick = async () => {
      const content = files[activeFileTabIndex]?.content ?? ''
      await navigator.clipboard.writeText(content)
      copyBtn.innerHTML = checkIconSVG
      copyBtn.classList.add('copied')
      setTimeout(() => {
        copyBtn.innerHTML = copyIconSVG
        copyBtn.classList.remove('copied')
      }, 2000)
    }
    tabsContainer.appendChild(copyBtn)
  }
}

/**
 * Sync file tab selection across both source instances
 */
function syncFileTabSelection() {
  fileTabsSource.querySelectorAll('.file-tab').forEach((t, i) => {
    t.classList.toggle('active', i === activeFileTabIndex)
  })
  sourceContainerSource.querySelectorAll('.source-file').forEach((f, i) => {
    f.classList.toggle('active', i === activeFileTabIndex)
  })
  fileTabsBoth.querySelectorAll('.file-tab').forEach((t, i) => {
    t.classList.toggle('active', i === activeFileTabIndex)
  })
  sourceContainerBoth.querySelectorAll('.source-file').forEach((f, i) => {
    f.classList.toggle('active', i === activeFileTabIndex)
  })
}

/**
 * Mark the tab and show the panel of a view mode ('both', 'preview' or 'source')
 */
function showPanel(mode: string) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === mode))
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'))
  activeTab = mode

  if (mode === 'preview') previewPanel.classList.add('active')
  if (mode === 'source') sourcePanel.classList.add('active')
  if (mode === 'both') bothPanel.classList.add('active')
}

/**
 * Open or close the sidebar overlay (narrow screens only, see explorer.css)
 */
function setSidebarOpen(open: boolean) {
  viewer.classList.toggle('sidebar-open', open)
  sidebarToggle.setAttribute('aria-expanded', String(open))
}

sidebarToggle.addEventListener('click', () => setSidebarOpen(!viewer.classList.contains('sidebar-open')))
sidebarBackdrop.addEventListener('click', () => setSidebarOpen(false))
document.addEventListener('keydown', e => { if (e.key === 'Escape') setSidebarOpen(false) })

/**
 * Handle tab switching
 */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', async () => {
    await disposeDemos()
    const mode = tab.getAttribute('data-tab')!
    showPanel(mode)

    if (currentDemo && currentDemoModules.size > 0 && (mode === 'preview' || mode === 'both')) {
      let runMethod = null

      if (currentDemo.hasDemoTs) {
        const demoModule = currentDemoModules.get('demo.ts')
        if (demoModule && typeof demoModule.run === 'function') {
          runMethod = demoModule.run
        }
      }

      if (!runMethod) {
        for (const [, module] of currentDemoModules) {
          if (typeof module.run === 'function') {
            runMethod = module.run
            break
          }
        }
      }

      if (runMethod) {
        if (mode === 'preview') {
          previewStage.innerHTML = ''
          runMethod(previewStage)
        } else if (mode === 'both') {
          bothStage.innerHTML = ''
          runMethod(bothStage)
        }
      }
    }
  })
})

/**
 * Setup resizer drag behaviour
 */
function setupResizer() {
  let isResizing = false

  resizer.addEventListener('mousedown', () => {
    isResizing = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  })

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return
    const bothPanelRect = bothPanel.getBoundingClientRect()
    const newSourceWidth = bothPanelRect.right - e.clientX
    const clampedWidth = Math.max(200, Math.min(newSourceWidth, bothPanelRect.width * 0.8))
    document.documentElement.style.setProperty('--source-panel-width', `${clampedWidth}px`)
  })

  document.addEventListener('mouseup', () => {
    isResizing = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  })
}

/**
 * Load and display the home screen
 */
async function loadHomePackage() {
  const homePkg = PACKAGES.find(pkg => pkg.isHome)
  if (!homePkg) return

  const manifestUrl = `${import.meta.env.BASE_URL}${homePkg.manifestFile}`
  const response = await fetch(manifestUrl)
  if (!response.ok) throw new Error(`Failed to fetch home manifest: ${response.status}`)
  const manifest: DemoManifest = await response.json()

  loadedPackages.set(homePkg.name, manifest)
}

/**
 * Show the home screen
 */
async function showHomeScreen() {
  const homePkg = PACKAGES.find(pkg => pkg.isHome)
  if (!homePkg) return

  const manifest = loadedPackages.get(homePkg.name)
  if (!manifest || manifest.demos.length === 0) return

  const homeDemo = manifest.demos[0]
  await loadDemo(homeDemo, homePkg.folder)

  title.textContent = 'Welcome'
  category.textContent = ''

  currentDemo = null
  currentDemoModules.clear()
}

/**
 * Load a package manifest and populate its content
 */
async function loadPackage(pkg: PackageConfig) {
  try {
    if (loadedPackages.has(pkg.name)) return

    const manifestUrl = `${import.meta.env.BASE_URL}${pkg.manifestFile}`
    const response = await fetch(manifestUrl)
    if (!response.ok) throw new Error(`Failed to fetch manifest for ${pkg.name}: ${response.status}`)
    const manifest: DemoManifest = await response.json()

    loadedPackages.set(pkg.name, manifest)
    console.log(`📦 Loaded ${manifest.demos.length} items from ${pkg.name}`)

    buildPackageContent(pkg, manifest)
  } catch (error) {
    console.error(`Failed to load package ${pkg.name}:`, error)
    const packageContent = packageElements.get(pkg.name)
    if (packageContent) {
      packageContent.innerHTML = '<div style="padding: 20px; color: #e53e3e;">Failed to load package.</div>'
    }
  }
}

/**
 * Build the sidebar with all package sections
 */
function buildPackageSidebar() {
  list.innerHTML = ''

  PACKAGES.filter(pkg => !pkg.isHome).forEach(pkg => {
    const packageWrapper = document.createElement('div')
    packageWrapper.className = 'package-section'

    const packageTitle = document.createElement('div')
    packageTitle.className = 'package-title'
    packageTitle.textContent = pkg.name
    packageTitle.onclick = async () => {
      const wasExpanded = packageWrapper.classList.contains('expanded')
      if (!wasExpanded) {
        packageWrapper.classList.add('expanded')
        if (!loadedPackages.has(pkg.name)) {
          await loadPackage(pkg)
        }
      } else {
        packageWrapper.classList.remove('expanded')
      }
    }

    const packageContent = document.createElement('div')
    packageContent.className = 'package-content'

    packageWrapper.appendChild(packageTitle)
    packageWrapper.appendChild(packageContent)
    list.appendChild(packageWrapper)

    packageElements.set(pkg.name, packageContent)
  })
}

/**
 * Load manifest and build UI
 */
async function init() {
  try {
    await loadHomePackage()
    buildPackageSidebar()
    setupResizer()

    // Below 900px there is too little room for canvas and code side by side
    if (window.matchMedia('(max-width: 900px)').matches) {
      showPanel('preview')
    }

    homeButton.addEventListener('click', () => {
      setSidebarOpen(false)
      setDeepLink(null)
      showHomeScreen()
    })
    window.addEventListener('hashchange', () => { openDeepLink() })

    if (!await openDeepLink()) {
      await showHomeScreen()
    }

    const defaultPackage = PACKAGES.find(pkg => pkg.expandByDefault)
    if (defaultPackage) {
      packageElements.get(defaultPackage.name)?.parentElement?.classList.add('expanded')
      await loadPackage(defaultPackage)
    }
  } catch (error) {
    console.error('Failed to initialize:', error)
    list.innerHTML = '<div style="padding: 20px; color: #e53e3e;">Failed to initialize package explorer.</div>'
  }
}

init()