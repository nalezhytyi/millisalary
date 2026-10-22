import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import { initAmplitude } from './amplitude'
import { removeLegacyStorageKeys } from './utils/legacyStorage'
import './index.css'

void initAmplitude()
removeLegacyStorageKeys()

if (import.meta.env.PROD) {
  registerSW({ immediate: true })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
