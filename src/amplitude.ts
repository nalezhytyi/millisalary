import * as amplitude from '@amplitude/analytics-browser'
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser'

const AMPLITUDE_API_KEY = '919afd003429ad6d69798aacb0c0c0a7'

const AMPLITUDE_ANALYTICS_OPTIONS = {
  autocapture: true,
} as const

const AMPLITUDE_SESSION_REPLAY_OPTIONS = {
  sampleRate: 1,
} as const

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

  amplitudeInitPromise = amplitude
    .init(AMPLITUDE_API_KEY, AMPLITUDE_ANALYTICS_OPTIONS)
    .promise
    .then(() =>
      amplitude.add(sessionReplayPlugin(AMPLITUDE_SESSION_REPLAY_OPTIONS)).promise
    )
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

  void (amplitudeInitPromise ?? Promise.resolve()).then(() => {
    amplitude.track(eventName, eventProperties)
  })
}
