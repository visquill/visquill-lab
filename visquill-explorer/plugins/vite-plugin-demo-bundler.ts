import { Plugin } from 'vite'
import * as fs from 'fs'
import * as path from 'path'
import { build } from 'vite'

interface DemoTarget {
    demosDir: string
    outDir: string
}

interface DemoBundlerOptions {
    targets: DemoTarget[]
    exclude?: string[]
    /** Output folder the target outDirs are in (default 'dist') */
    distDir?: string
}

/** The GDK as a fixed entry: every demo imports it from here, and the explorer disposes through it. */
export const SHARED_GDK = 'shared/visquill-gdk'

/**
 * Vite plugin that bundles demo TypeScript files for production.
 * Works with a folder-centric approach where each folder = one demo.
 * All .ts files of all demo folders are built in one build, each as its own entry
 * (`<outDir>/<folder>/<file>.js`, as before). Code they share — the GDK, MapLibre, blueprints —
 * goes into chunks under `shared/` once instead of into every demo.
 */
export function demoBundlerPlugin(options: DemoBundlerOptions): Plugin {
    const excludedFolders = new Set([
        'node_modules',
        'dist',
        'build',
        '.git',
        '.vite',
        ...(options.exclude || [])
    ])

    const distDir = options.distDir || 'dist'
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
     * Demo folders of a target with their output folder
     */
    function targetFolders(target: DemoTarget): Array<{ relativePath: string, absolutePath: string, outputDir: string }> {
        const absoluteDemosDir = path.isAbsolute(target.demosDir)
            ? target.demosDir
            : path.resolve(process.cwd(), target.demosDir)

        if (!fs.existsSync(absoluteDemosDir)) {
            console.warn(`⚠️  Demos directory not found: ${absoluteDemosDir}`)
            return []
        }

        const baseFolderName = path.relative(process.cwd(), absoluteDemosDir)
        return findDemoFolders(absoluteDemosDir).map(({ path: relativePath, absolutePath }) => ({
            relativePath,
            absolutePath,
            outputDir: path.join(target.outDir, baseFolderName, relativePath.replace(/\\/g, '/'))
        }))
    }

    /**
     * Copy all demo-related files to build output
     */
    function copyDemoAssets() {
        console.log('📦 Copying demo assets to build output...')

        for (const target of options.targets) {
            for (const { relativePath, absolutePath, outputDir } of targetFolders(target)) {
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true })
                }

                // Copy all .ts files
                for (const tsFile of getFilesByExtension(absolutePath, '.ts')) {
                    fs.copyFileSync(tsFile, path.join(outputDir, path.basename(tsFile)))
                }

                // Copy the first CSS, SCSS and Markdown file (if any)
                for (const extension of ['.css', '.scss', '.md']) {
                    const file = getFilesByExtension(absolutePath, extension)[0]
                    if (file) {
                        fs.copyFileSync(file, path.join(outputDir, path.basename(file)))
                    }
                }

                console.log(`  ✔ Copied: ${relativePath}`)
            }
        }

        console.log('✅ Demo assets copied successfully')
    }

    /**
     * Build all demos as ES modules in one build, with shared chunks
     */
    async function buildDemos() {
        console.log('🔨 Building demo modules...')

        // Entry name = output path below distDir without extension
        const input: Record<string, string> = {
            [SHARED_GDK]: '@visquill/visquill-gdk'
        }
        for (const target of options.targets) {
            for (const { absolutePath, outputDir } of targetFolders(target)) {
                for (const tsFile of getFilesByExtension(absolutePath, '.ts')) {
                    const name = path.relative(distDir, path.join(outputDir, path.basename(tsFile, '.ts')))
                    input[name.replace(/\\/g, '/')] = tsFile
                }
            }
        }

        await build({
            configFile: false,
            logLevel: 'warn',
            // Asset URLs relative to the chunk, so the build works under any path
            // (the explorer's /visquill-explorer/, the lab pages' /lab/embed/assets/)
            base: './',
            build: {
                outDir: distDir,
                emptyOutDir: false,
                minify: false,
                manifest: false,
                ssrManifest: false,
                modulePreload: false,
                copyPublicDir: false,
                rollupOptions: {
                    input,
                    // Keep each entry's exports (run); Vite drops them by default for app builds
                    preserveEntrySignatures: 'strict',
                    output: {
                        entryFileNames: '[name].js',
                        chunkFileNames: 'shared/[name]-[hash].js',
                        assetFileNames: 'shared/[name]-[hash][extname]'
                    }
                }
            }
        })

        console.log(`✅ Demo modules built successfully (${Object.keys(input).length - 1} entries)`)
    }

    return {
        name: 'vite-plugin-demo-bundler',

        configResolved(config) {
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
