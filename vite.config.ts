import path from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'apple-touch-icon.png',
        'pwa-square-192x192.png',
        'pwa-square-512x512.png',
        'pwa-maskable-512x512.png',
        // static face for the Breakdown card and reduced-motion dial
        'images/money-face.png',
      ],
      workbox: {
        // The animated dial face (0.7 MB) is too heavy to precache; keep it
        // after the first online load (main.tsx covers the first visit) so
        // it also shows offline, and revalidate since its URL isn't
        // content-hashed
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith('/money-face.webp'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'images' },
          },
        ],
      },
      manifest: {
        id: '/millisalary/',
        name: 'Millisalary',
        short_name: 'Millisalary',
        description:
          'Track your earnings in real time and estimate your salary.',
        theme_color: '#f2f2f7',
        background_color: '#f2f2f7',
        display: 'standalone',
        scope: '/millisalary/',
        start_url: '/millisalary/',
        // New file names whenever the artwork changes: Chrome only refreshes
        // an installed app's icon when these entries change
        icons: [
          {
            src: 'pwa-square-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-square-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          // Full bleed for Android, which crops it to the launcher's shape
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
    // `pnpm run analyze` only: a treemap of the bundle, written outside
    // build/ so the service worker doesn't precache it
    mode === 'analyze' &&
      visualizer({
        filename: 'bundle-stats.html',
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
      }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    open: true,
    port: 3000,
  },
  base: '/millisalary/',
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          // Changes rarely, so a deploy doesn't make the service worker
          // download React again
          vendor: [
            'react',
            'react/jsx-runtime',
            'react-dom',
            'react-dom/client',
          ],
        },
      },
    },
  },
}))
