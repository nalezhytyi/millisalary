// The splash itself lives in index.html so it paints before any JS runs. This
// runs its life cycle: the face plays one cycle of its animation, then flies to
// the dial's face (the splash <img> and the dial <img> share one URL, and
// browsers keep one animation clock per image, so the swap on landing shows
// the same frame) while the background dissolves.

// 150 frames x 20 ms, see public/images/money-face.webp
const CYCLE_MS = 3000
const REDUCED_MOTION_HOLD_MS = 800
const SLOW_FACE_MS = 1500
const MOUNT_TIMEOUT_MS = 2000
const FLIGHT_MS = 500
const FADE_MS = 300
const REDUCED_MOTION_FADE_MS = 200
const EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

// The dial mounts with React, which may not have run yet
function waitForDialFace() {
  const find = () => document.querySelector<HTMLElement>('[data-dial-face]')
  const found = find()
  if (found) return Promise.resolve(found)

  return new Promise<HTMLElement | null>((resolve) => {
    const done = (face: HTMLElement | null) => {
      observer.disconnect()
      clearTimeout(timer)
      resolve(face)
    }
    const observer = new MutationObserver(() => {
      const face = find()
      if (face) done(face)
    })
    const timer = setTimeout(() => done(null), MOUNT_TIMEOUT_MS)
    observer.observe(document.getElementById('root') ?? document.body, {
      childList: true,
      subtree: true,
    })
  })
}

async function flyToDial(
  splash: HTMLElement,
  face: HTMLElement,
  target: HTMLElement
) {
  const from = face.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)

  // The dial's own face stays hidden until the splash's one lands on it
  target.style.visibility = 'hidden'
  splash.style.pointerEvents = 'none'

  const background = getComputedStyle(splash).backgroundColor
  splash.animate(
    [{ backgroundColor: background }, { backgroundColor: 'transparent' }],
    { duration: FADE_MS, easing: 'ease-out', fill: 'forwards' }
  )
  await face.animate(
    [
      { transform: 'none' },
      {
        transform: `translate(${dx}px, ${dy}px) scale(${to.width / from.width})`,
      },
    ],
    { duration: FLIGHT_MS, easing: EASING, fill: 'forwards' }
  ).finished

  target.style.visibility = ''
}

async function fadeOut(splash: HTMLElement) {
  await splash.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: REDUCED_MOTION_FADE_MS,
    fill: 'forwards',
  }).finished
}

export async function runSplash() {
  const splash = document.getElementById('splash')
  const face = splash?.querySelector('img')
  if (!splash || !face) return

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  let skip = () => {}
  const skipped = new Promise<void>((resolve) => (skip = resolve))
  splash.addEventListener('pointerdown', () => skip(), { once: true })

  // First visit on a slow network: show the static face instead of an empty
  // splash
  const slowFaceTimer = setTimeout(() => {
    if (!face.complete) {
      face.src = `${import.meta.env.BASE_URL}images/money-face.png`
    }
  }, SLOW_FACE_MS)

  let target: HTMLElement | null = null
  try {
    // The animation starts when the face is first painted, about when it has
    // decoded
    await face.decode().catch(() => {})
    await Promise.race([
      sleep(reducedMotion ? REDUCED_MOTION_HOLD_MS : CYCLE_MS),
      skipped,
    ])
    target = await waitForDialFace()
    if (reducedMotion || !target) await fadeOut(splash)
    else await flyToDial(splash, face, target)
  } catch {
    // Never leave the splash covering the app
  } finally {
    clearTimeout(slowFaceTimer)
    if (target) target.style.visibility = ''
    splash.remove()
    document.documentElement.classList.remove('splash-active')
  }
}
