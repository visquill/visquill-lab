import { Plugin } from 'vite'
import * as fs from 'fs'
import * as path from 'path'
import { marked } from 'marked'

interface DemoFile {
    name: string
    category: string
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

/**
 * Vite plugin that scans the demos folder and generates a manifest.json.
 * The manifest contains all demo metadata and pre-rendered markdown HTML.
 * Works with a folder-centric approach where each folder = one demo.
 */
export function demoScannerPlugin(options: {
    demosDir?: string | string[]
    exclude?: string[]
    outFile?: string
} = {}): Plugin {
    const demosDirs = Array.isArray(options.demosDir)
        ? options.demosDir
        : [options.demosDir || 'demos']

    const excludedFolders = new Set([
        'node_modules',
        'dist',
        'build',
        '.git',
        '.vite',
        ...(options.exclude || [])
    ])

    let manifestPath: string
    let publicDir: string

    /**
     * Recursively find all folders containing .ts files
     * Each folder represents one demo
     */
    function findDemoFolders(dir: string, basePath: string = ''): Array<{ path: string, absolutePath: string }> {
        const results: Array<{ path: string, absolutePath: string }> = []

        if (!fs.existsSync(dir)) {
            return results
        }

        const entries = fs.readdirSync(dir, { withFileTypes: true })

        // Check if current folder has any .ts files
        const hasTs = entries.some(entry => entry.isFile() && entry.name.endsWith('.ts'))

        // Only add if this is not the root folder (basePath must have content)
        if (hasTs && basePath) {
            results.push({
                path: basePath,
                absolutePath: dir
            })
        }

        // Recursively check subdirectories
        for (const entry of entries) {
            if (entry.isDirectory()) {
                if (excludedFolders.has(entry.name)) {
                    continue
                }

                const subPath = path.join(dir, entry.name)
                const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name
                results.push(...findDemoFolders(subPath, relativePath))
            }
        }

        return results
    }

    /**
     * Get all TypeScript files in a folder
     */
    function getTsFiles(folderPath: string): string[] {
        if (!fs.existsSync(folderPath)) {
            return []
        }

        return fs.readdirSync(folderPath)
            .filter(file => file.endsWith('.ts'))
            .map(file => path.join(folderPath, file)).filter(file => !file.endsWith('index.ts'))
    }

    /**
     * Find the first CSS file in a folder
     */
    function findFile(folderPath: string, ending: string): string | null {
        if (!fs.existsSync(folderPath)) {
            return null
        }

        const files = fs.readdirSync(folderPath)
            .filter(file => file.endsWith(ending))

        return files.length > 0 ? path.join(folderPath, files[0]) : null
    }

    /**
     * Find the first Markdown file in a folder
     */
    function findMarkdownFile(folderPath: string): string | null {
        if (!fs.existsSync(folderPath)) {
            return null
        }

        const mdFiles = fs.readdirSync(folderPath)
            .filter(file => file.endsWith('.md'))

        return mdFiles.length > 0 ? path.join(folderPath, mdFiles[0]) : null
    }

    /**
     * Generate manifest from all demo directories
     */
    function generateManifest() {
        console.log('🔍 Scanning demo folders (folder-centric)...')

        const demos: DemoFile[] = []
        const categories = new Set<string>()

        for (const demosDir of demosDirs) {
            const absoluteDemosDir = path.isAbsolute(demosDir)
                ? demosDir
                : path.resolve(process.cwd(), demosDir)

            if (!fs.existsSync(absoluteDemosDir)) {
                console.warn(`⚠️  Demos directory not found: ${absoluteDemosDir}`)
                continue
            }

            console.log(`📂 Scanning: ${absoluteDemosDir}`)

            const baseFolderName = path.relative(process.cwd(), absoluteDemosDir)
            const demoFolders = findDemoFolders(absoluteDemosDir)

            console.log(`   Found ${demoFolders.length} demo folders`)
            demoFolders.forEach(folder => {
                console.log(`   - ${folder.path || '(root)'}`)
            })

            for (const { path: relativePath, absolutePath } of demoFolders) {
                // Get all TypeScript files in this folder
                const tsFiles = getTsFiles(absolutePath)
                if (tsFiles.length === 0) {
                    continue
                }

                // Read first TS file for metadata
                const firstTsContent = fs.readFileSync(tsFiles[0], 'utf-8')
                const metadata = extractMetadata(firstTsContent)

                // Determine category from metadata or folder structure
                let category = metadata.category
                if (!category) {
                    const pathParts = relativePath.split(path.sep)
                    category = pathParts.length > 0 && relativePath
                        ? formatName(pathParts[0])
                        : 'Uncategorized'
                }

                categories.add(category)

                // Determine demo name from metadata or folder name
                const folderName = path.basename(absolutePath)
                const demoName = metadata.name || formatName(folderName)

                // Check if demo.ts exists
                const hasDemoTs = tsFiles.some(f => path.basename(f) === 'demo.ts')

                // Build TypeScript files array
                const tsFilesData = tsFiles.map(tsFile => ({
                    path: relativePath
                        ? `/${baseFolderName}/${relativePath.replace(/\\/g, '/')}/${path.basename(tsFile)}`
                        : `/${baseFolderName}/${path.basename(tsFile)}`,
                    content: cleanSourceCode(fs.readFileSync(tsFile, 'utf-8')),
                    fileName: path.basename(tsFile)
                }))

                const demo: DemoFile = {
                    name: demoName,
                    category,
                    description: metadata.description,
                    slug: relativePath || folderName,
                    folderPath: relativePath
                        ? `/${baseFolderName}/${relativePath.replace(/\\/g, '/')}`
                        : `/${baseFolderName}`,
                    tsFiles: tsFilesData,
                    hasDemoTs
                }

                // Find and add CSS file
                const cssFile = findFile(absolutePath,"css")
                if (cssFile) {
                    const cssFileName = path.basename(cssFile)
                    demo.cssFile = {
                        path: relativePath
                            ? `/${baseFolderName}/${relativePath.replace(/\\/g, '/')}/${cssFileName}`
                            : `/${baseFolderName}/${cssFileName}`,
                        content: fs.readFileSync(cssFile, 'utf-8'),
                        fileName: cssFileName
                    }
                }


                // Find and add CSS file
                const scssFile = findFile(absolutePath,"scss")
                if (scssFile) {
                    const scssFileName = path.basename(scssFile)
                    demo.scssFile = {
                        path: relativePath
                            ? `/${baseFolderName}/${relativePath.replace(/\\/g, '/')}/${scssFileName}`
                            : `/${baseFolderName}/${scssFileName}`,
                        content: fs.readFileSync(scssFile, 'utf-8'),
                        fileName: scssFileName
                    }
                }

                // Find and add Markdown file
                const mdFile = findMarkdownFile(absolutePath)
                if (mdFile) {
                    const mdFileName = path.basename(mdFile)
                    const mdContent = fs.readFileSync(mdFile, 'utf-8')
                    const rawHtml = marked.parse(mdContent) as string

                    demo.mdFile = {
                        path: relativePath
                            ? `/${baseFolderName}/${relativePath.replace(/\\/g, '/')}/${mdFileName}`
                            : `/${baseFolderName}/${mdFileName}`,
                        html: rawHtml,
                        fileName: mdFileName
                    }
                }

                demos.push(demo)
                console.log(`  ✔ Found: ${relativePath || folderName} (${tsFiles.length} TS files${hasDemoTs ? ', has demo.ts' : ''})`)
            }
        }

        // Sort demos
        demos.sort((a, b) => {
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category)
            }
            return a.folderPath.localeCompare(b.folderPath)
        })

        const manifest: DemoManifest = {
            demos,
            categories: Array.from(categories).sort(),
            generatedAt: new Date().toISOString()
        }

        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true })
        }
        fs.writeFileSync(
            manifestPath,
            JSON.stringify(manifest, null, 2),
            'utf-8'
        )

        console.log(`✅ Generated manifest with ${demos.length} demos across ${categories.size} categories`)
    }

    return {
        name: 'vite-plugin-demo-scanner',

        configResolved(config) {
            publicDir = config.publicDir
            manifestPath = path.join(publicDir, options.outFile ?? 'manifest.json')
            // Generate immediately so manifests exist before the server opens
            generateManifest()
        },

        buildStart() {
            // Still needed for production builds
            if (process.env.NODE_ENV !== 'development') {
                generateManifest()
            }
        },

        configureServer(server) {
            const watchDirs = demosDirs.map(dir => {
                const absoluteDir = path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir)
                return path.join(absoluteDir, '**/*')
            })

            watchDirs.forEach(dir => server.watcher.add(dir))

            server.watcher.on('change', (file) => {
                const isInDemoDir = demosDirs.some(dir => {
                    const absoluteDir = path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir)
                    return file.includes(absoluteDir)
                })

                if (isInDemoDir) {
                    console.log('🔄 Demo files changed, regenerating manifest...')
                    generateManifest()
                    server.ws.send({ type: 'full-reload' })
                }
            })
        }
    }
}

/**
 * Extract metadata from special comments in TypeScript files
 */
function extractMetadata(content: string): {
    name?: string
    category?: string
    description?: string
} {
    const metadata: any = {}

    const nameMatch = content.match(/\/\/\s*@name\s+(.+)/i)
    if (nameMatch) metadata.name = nameMatch[1].trim()

    const categoryMatch = content.match(/\/\/\s*@category\s+(.+)/i)
    if (categoryMatch) metadata.category = categoryMatch[1].trim()

    const descMatch = content.match(/\/\/\s*@description\s+(.+)/i)
    if (descMatch) metadata.description = descMatch[1].trim()

    return metadata
}

/**
 * Remove metadata comments and clean up source for display
 */
function cleanSourceCode(content: string): string {
    let cleaned = content.replace(/\/\/\s*@(name|category|description)\s+.+\n/gi, '')
    cleaned = cleaned.trim()
    return cleaned
}

/**
 * Convert folder or file name to readable demo name
 */
function formatName(name: string): string {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}