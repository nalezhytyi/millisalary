import path from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        // static face for the Breakdown card and reduced-motion dial
        'images/money-face.png',
      ],
      workbox: {
        // The animated dial face (2.4 MB) is too heavy to precache; keep it
        // after the first online load so it also shows offline
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith('/money-face.gif'),
            handler: 'CacheFirst',
            options: { cacheName: 'images' },
          },
        ],
      },
      manifest: {
        id: '/millisalary/',
        name: 'Millisalary',
        short_name: 'Millisalary',
        description: 'Track your earnings in real time and estimate your salary.',
        theme_color: '#f2f2f7',
        background_color: '#f2f2f7',
        display: 'standalone',
        scope: '/millisalary/',
        start_url: '/millisalary/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
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
          vendor: ['react'],
        },
      },
    },
  },
})
