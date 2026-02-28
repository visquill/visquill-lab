import { Plugin } from 'vite'
import * as fs from 'fs'
import * as path from 'path'
import { build } from 'vite'

interface DemoBundlerOptions {
    demosDir: string | string[]
    outDir?: string
    exclude?: string[]
}

/**
 * Vite plugin that bundles demo TypeScript files for production.
 * Works with a folder-centric approach where each folder = one demo.
 * All .ts files in a folder are bundled together.
 */
export function demoBundlerPlugin(options: DemoBundlerOptions): Plugin {
    const demosDirs = Array.isArray(options.demosDir)
        ? options.demosDir
        : [options.demosDir]

    const excludedFolders = new Set([
        'node_modules',
        'dist',
        'build',
        '.git',
        '.vite',
        ...(options.exclude || [])
    ])

    let outDir = options.outDir || 'dist'
    let isBuild = false

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
     * Get all files in a folder by extension
     */
    function getFilesByExtension(folderPath: string, extension: string): string[] {
        if (!fs.existsSync(folderPath)) {
            return []
        }

        return fs.readdirSync(folderPath)
            .filter(file => file.endsWith(extension))
            .map(file => path.join(folderPath, file))
    }

    /**
     * Copy all demo-related files to build output
     */
    function copyDemoAssets() {
        console.log('📦 Copying demo assets to build output...')

        for (const demosDir of demosDirs) {
            const absoluteDemosDir = path.isAbsolute(demosDir)
                ? demosDir
                : path.resolve(process.cwd(), demosDir)

            if (!fs.existsSync(absoluteDemosDir)) {
                console.warn(`⚠️  Demos directory not found: ${absoluteDemosDir}`)
                continue
            }

            const baseFolderName = path.relative(process.cwd(), absoluteDemosDir)
            const demoFolders = findDemoFolders(absoluteDemosDir)

            console.log(`📂 Found ${demoFolders.length} demo folders in ${baseFolderName}:`)
            demoFolders.forEach(folder => {
                console.log(`   - ${folder.path || '(root)'} -> ${folder.absolutePath}`)
            })

            for (const { path: relativePath, absolutePath } of demoFolders) {
                const outputDir = path.join(
                    outDir,
                    baseFolderName,
                    relativePath.replace(/\\/g, '/')
                )

                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true })
                }

                // Copy all .ts files
                const tsFiles = getFilesByExtension(absolutePath, '.ts')
                for (const tsFile of tsFiles) {
                    const fileName = path.basename(tsFile)
                    const tsTarget = path.join(outputDir, fileName)
                    fs.copyFileSync(tsFile, tsTarget)
                }

                // Copy CSS file (if exists)
                const cssFiles = getFilesByExtension(absolutePath, '.css')
                if (cssFiles.length > 0) {
                    const cssFile = cssFiles[0] // Take first CSS file
                    const cssFileName = path.basename(cssFile)
                    const cssTarget = path.join(outputDir, cssFileName)
                    fs.copyFileSync(cssFile, cssTarget)
                }

                // Copy SCSS file (if exists)
                const scssFiles = getFilesByExtension(absolutePath, '.scss')
                if (scssFiles.length > 0) {
                    const scssFile = scssFiles[0] // Take first CSS file
                    const scssFileName = path.basename(scssFile)
                    const scssTarget = path.join(outputDir, scssFileName)
                    fs.copyFileSync(scssFile, scssTarget)
                }

                // Copy Markdown file (if exists)
                const mdFiles = getFilesByExtension(absolutePath, '.md')
                if (mdFiles.length > 0) {
                    const mdFile = mdFiles[0] // Take first MD file
                    const mdFileName = path.basename(mdFile)
                    const mdTarget = path.join(outputDir, mdFileName)
                    fs.copyFileSync(mdFile, mdTarget)
                }

                const relativeDisplay = relativePath || path.basename(absolutePath)
                console.log(`  ✔ Copied: ${baseFolderName}/${relativeDisplay}`)
            }
        }

        console.log('✅ Demo assets copied successfully')
    }

    /**
     * Build demos as ES modules
     */
    async function buildDemos() {
        console.log('🔨 Building demo modules...')

        for (const demosDir of demosDirs) {
            const absoluteDemosDir = path.isAbsolute(demosDir)
                ? demosDir
                : path.resolve(process.cwd(), demosDir)

            if (!fs.existsSync(absoluteDemosDir)) {
                continue
            }

            const baseFolderName = path.relative(process.cwd(), absoluteDemosDir)
            const demoFolders = findDemoFolders(absoluteDemosDir)

            console.log(`🔨 Building ${demoFolders.length} demo folders in ${baseFolderName}`)

            for (const { path: relativePath, absolutePath } of demoFolders) {
                const tsFiles = getFilesByExtension(absolutePath, '.ts')

                const outputDir = path.join(
                    outDir,
                    baseFolderName,
                    relativePath.replace(/\\/g, '/')
                )

                // Remove manifest files if they exist
                const manifestToDelete = path.join(outputDir, 'manifest.json')
                if (fs.existsSync(manifestToDelete)) {
                    fs.unlinkSync(manifestToDelete)
                }

                // Build each TypeScript file
                for (const tsFile of tsFiles) {
                    const fileName = path.basename(tsFile, '.ts')

                    try {
                        await build({
                            configFile: false,
                            build: {
                                lib: {
                                    entry: tsFile,
                                    formats: ['es'],
                                    fileName: () => `${fileName}.js`
                                },
                                outDir: outputDir,
                                emptyOutDir: false,
                                minify: false,
                                manifest: false,
                                ssrManifest: false,
                                rollupOptions: {
                                    external: [],
                                    output: {
                                        inlineDynamicImports: true
                                    }
                                }
                            }
                        })

                        // Clean up manifest again if it was created
                        if (fs.existsSync(manifestToDelete)) {
                            fs.unlinkSync(manifestToDelete)
                        }
                    } catch (error) {
                        console.error(`  ✗ Failed to build ${fileName}:`, error)
                    }
                }

                const relativeDisplay = relativePath || path.basename(absolutePath)
                console.log(`  ✔ Built: ${baseFolderName}/${relativeDisplay} (${tsFiles.length} files)`)
            }
        }

        console.log('✅ Demo modules built successfully')
    }

    return {
        name: 'vite-plugin-demo-bundler',

        configResolved(config) {
            // outDir = config.build.outDir
            isBuild = config.command === 'build'
        },

        async closeBundle() {
            if (isBuild) {
                copyDemoAssets()
                await buildDemos()
            }
        }
    }
}