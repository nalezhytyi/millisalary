import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { trackAmplitudeEvent } from '../amplitude'
import { useLocalStorage } from './useLocalStorage'

export type InstallPlatform = 'ios' | 'android'

// Chromium's install prompt event (not in the DOM typings)
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Chrome can fire beforeinstallprompt before React mounts, so it's captured
// as soon as this module loads and kept for the banner's Install button
let deferredPrompt: BeforeInstallPromptEvent | null = null
const promptListeners = new Set<() => void>()

const setDeferredPrompt = (event: BeforeInstallPromptEvent | null) => {
  deferredPrompt = event
  promptListeners.forEach((listener) => listener())
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Keep Chrome's own mini-infobar away; the banner offers the install
    event.preventDefault()
    setDeferredPrompt(event as BeforeInstallPromptEvent)
  })
}

const subscribeToPrompt = (listener: () => void) => {
  promptListeners.add(listener)

  return () => {
    promptListeners.delete(listener)
  }
}

const getDeferredPrompt = () => deferredPrompt

// Phones in a browser tab only: never in the installed app, on desktop or
// iPad. On iPhone the sheet walks through Safari's own steps, so other iOS
// browsers and in-app web views are left out.
const detectPlatform = (): InstallPlatform | null => {
  const isStandalone =
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    matchMedia('(display-mode: standalone)').matches

  if (isStandalone) {
    return null
  }

  const ua = navigator.userAgent

  if (
    /iPhone|iPod/.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|FBAN|FBAV|Instagram|Line\//.test(ua)
  ) {
    return 'ios'
  }

  if (/Android/.test(ua) && /Mobile/.test(ua)) {
    return 'android'
  }

  return null
}

export const useInstallPrompt = () => {
  const [platform] = useState(detectPlatform)
  const [isBannerHidden, setIsBannerHidden] = useLocalStorage(
    'installBannerHidden',
    false
  )
  const [isInstallSheetOpen, setIsInstallSheetOpen] = useState(false)
  const prompt = useSyncExternalStore(subscribeToPrompt, getDeferredPrompt)

  useEffect(() => {
    if (platform !== 'android') {
      return
    }

    const handleInstalled = () => {
      setDeferredPrompt(null)
      setIsBannerHidden(true)
      trackAmplitudeEvent('app_installed', { platform })
    }

    window.addEventListener('appinstalled', handleInstalled)

    return () => window.removeEventListener('appinstalled', handleInstalled)
  }, [platform, setIsBannerHidden])

  // Android only offers an install while Chrome considers the app installable
  // and not yet installed, which is when it fires beforeinstallprompt
  const isInstallBannerVisible =
    !isBannerHidden &&
    (platform === 'ios' || (platform === 'android' && prompt !== null))

  const handleInstallClick = useCallback(() => {
    trackAmplitudeEvent('install_banner_clicked', { platform })

    if (platform === 'ios') {
      // Safari can't tell whether the app was added, so seeing the steps once
      // retires the banner
      setIsInstallSheetOpen(true)
      setIsBannerHidden(true)
      return
    }

    if (!prompt) {
      return
    }

    // The event can prompt only once; Chrome fires a new one if it's dismissed
    setDeferredPrompt(null)
    void prompt.prompt()
    void prompt.userChoice.then(({ outcome }) => {
      trackAmplitudeEvent('install_prompt_result', { outcome })
      if (outcome === 'accepted') {
        setIsBannerHidden(true)
      }
    })
  }, [platform, prompt, setIsBannerHidden])

  const handleDismissInstallBanner = useCallback(() => {
    setIsBannerHidden(true)
    trackAmplitudeEvent('install_banner_dismissed', { platform })
  }, [platform, setIsBannerHidden])

  const handleCloseInstallSheet = useCallback(
    () => setIsInstallSheetOpen(false),
    []
  )

  return {
    isInstallBannerVisible,
    isInstallSheetOpen,
    handleInstallClick,
    handleDismissInstallBanner,
    handleCloseInstallSheet,
  }
}
