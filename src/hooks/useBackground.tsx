import { useCallback, useMemo } from 'react'
import { trackAmplitudeEvent } from '../amplitude'
import Aurora from '../components/backgrounds/Aurora'
import DarkVeil from '../components/backgrounds/DarkVeil'
import Galaxy from '../components/backgrounds/Galaxy'
import LightRays from '../components/backgrounds/LightRays'
import { useLocalStorage } from './useLocalStorage'

export type BackgroundVariant =
  | 'aurora'
  | 'darkveil'
  | 'galaxy'
  | 'lightrays'

export const useBackground = () => {
  const [background, setBackground] =
    useLocalStorage<BackgroundVariant>('background', 'darkveil')

  const handleBackgroundChange = useCallback(
    (newBackground: BackgroundVariant) => {
      setBackground(newBackground)
      trackAmplitudeEvent('background_changed', {
        background: newBackground,
      })
    },
    [setBackground]
  )

  const backgroundComponent = useMemo(() => {
    if (background === 'aurora') {
      return <Aurora />
    }
    if (background === 'galaxy') {
      return (
        <Galaxy
          transparent={false}
          hueShift={180}
          glowIntensity={0.5}
          saturation={0.5}
          twinkleIntensity={0.4}
          rotationSpeed={0.02}
          density={1.2}
        />
      )
    }
    if (background === 'lightrays') {
      return (
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          fadeDistance={2}
          lightSpread={2}
          rayLength={3}
          saturation={2}
        />
      )
    }

    return <DarkVeil />
  }, [background])

  return {
    background,
    backgroundComponent,
    handleBackgroundChange,
  }
}
