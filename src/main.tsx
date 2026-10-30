import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import { initAmplitude } from './amplitude'
import { runSplash } from './splash'
import { removeLegacyStorageKeys } from './utils/legacyStorage'
import './index.css'

removeLegacyStorageKeys()

// A first visit loads its images before the service worker takes control, so
// the dial face never reaches the worker's runtime cache (vite.config.ts) and
// would be missing offline until the next visit. Once the worker controls the
// page and the page has loaded, request its images again through the worker;
// the HTTP cache answers, so nothing downloads twice
function cacheImagesOnceControlled() {
  if (!('serviceWorker' in navigator) || navigator.serviceWorker.controller) {
    return
  }
  const refetchImages = () => {
    const base = new URL(import.meta.env.BASE_URL, location.href).href
    for (const entry of performance.getEntriesByType('resource')) {
      if (
        (entry as PerformanceResourceTiming).initiatorType === 'img' &&
        entry.name.startsWith(base)
      ) {
        fetch(entry.name).catch(() => {})
      }
    }
  }
  navigator.serviceWorker.addEventListener(
    'controllerchange',
    () => {
      if (document.readyState === 'complete') refetchImages()
      else window.addEventListener('load', refetchImages, { once: true })
    },
    { once: true }
  )
}

if (import.meta.env.PROD) {
  registerSW({ immediate: true })
  cacheImagesOnceControlled()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

void runSplash()

// Analytics isn't needed for the first paint: load the SDK and session replay
// once the browser is idle after it, or after a timeout where
// requestIdleCallback is missing
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => void initAmplitude(), { timeout: 1000 })
} else {
  setTimeout(() => void initAmplitude(), 1)
}
