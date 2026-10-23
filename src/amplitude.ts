declare global {
  interface Window {
    __millisalaryAmplitudeInitialized__?: boolean
  }
}

let amplitudeInitPromise: Promise<void> | null = null

const isClient = () => typeof window !== 'undefined'

export const initAmplitude = () => {
  if (!isClient()) {
    return Promise.resolve()
  }

  if (amplitudeInitPromise) {
    return amplitudeInitPromise
  }

  if (window.__millisalaryAmplitudeInitialized__) {
    return Promise.resolve()
  }

  amplitudeInitPromise = import('./amplitudeClient')
    .then(({ startAmplitude }) => startAmplitude())
    .then(() => {
      window.__millisalaryAmplitudeInitialized__ = true
    })
    .catch((error) => {
      window.__millisalaryAmplitudeInitialized__ = false
      amplitudeInitPromise = null
      console.error('Failed to initialize Amplitude:', error)
    })

  return amplitudeInitPromise
}

export const trackAmplitudeEvent = (
  eventName: string,
  eventProperties?: Record<string, unknown>
) => {
  if (!isClient() || !window.__millisalaryAmplitudeInitialized__) {
    return
  }

  // initAmplitude already loaded the client, so this resolves from the
  // module cache (and still works after a hot reload of this file)
  void import('./amplitudeClient').then(({ track }) => {
    track(eventName, eventProperties)
  })
}
