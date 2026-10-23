// The Amplitude SDK and session replay, loaded lazily by ./amplitude so they
// stay out of the main chunk
import * as amplitude from '@amplitude/analytics-browser'
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser'

const AMPLITUDE_API_KEY = '919afd003429ad6d69798aacb0c0c0a7'

const AMPLITUDE_ANALYTICS_OPTIONS = {
  autocapture: true,
} as const

const AMPLITUDE_SESSION_REPLAY_OPTIONS = {
  sampleRate: 1,
} as const

export const startAmplitude = async () => {
  await amplitude.init(AMPLITUDE_API_KEY, AMPLITUDE_ANALYTICS_OPTIONS).promise

  const sessionReplay = sessionReplayPlugin(AMPLITUDE_SESSION_REPLAY_OPTIONS)
  await amplitude.add(sessionReplay).promise
}

export { track } from '@amplitude/analytics-browser'
