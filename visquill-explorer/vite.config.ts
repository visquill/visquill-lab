import { defineConfig } from 'vite'
import { demoScannerPlugin } from './plugins/vite-plugin-demo-scanner'
import { demoBundlerPlugin } from './plugins/vite-plugin-demo-bundler'
import path from 'path'

export default defineConfig({
  plugins: [
    demoScannerPlugin({
      demosDir: path.resolve(__dirname, '../concepts/src'),
      exclude: ['node_modules'],
      outFile: "concepts.json"
    }),
    demoScannerPlugin({
      demosDir: path.resolve(__dirname, '../blueprints/src'),
      exclude: ['node_modules'],
      outFile: "blueprints.json"
    }),
    demoScannerPlugin({
      demosDir: path.resolve(__dirname, '../home-screen/src'),
      exclude: ['node_modules'],
      outFile: "home.json"
    }),
    // All demos in one build, so the GDK, MapLibre and blueprints are shared chunks
    demoBundlerPlugin({
      targets: [
        { demosDir: path.resolve(__dirname, '../concepts/src'), outDir: 'dist/concepts' },
        { demosDir: path.resolve(__dirname, '../blueprints/src'), outDir: 'dist/blueprints' },
        { demosDir: path.resolve(__dirname, '../home-screen/src'), outDir: 'dist/home' },
      ],
      exclude: ['node_modules']
    })
  ],

  resolve: {
    alias: {
      '@visquill/visquill-blueprints': path.resolve(__dirname, '../blueprints/src/index.ts'),
      '/concepts': path.resolve(__dirname, '../concepts'),
      '/blueprints': path.resolve(__dirname, '../blueprints'),
      '/home-screen': path.resolve(__dirname, '../home-screen'),
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: false,
    rollupOptions: {
      output: {
        preserveModules: false,
        manualChunks: undefined
      }
    }
  },

  base: '/visquill-explorer/',

  server: {
    port: 3000,
    open: true,
    fs: {
      allow: ['..']
    }
  }
})