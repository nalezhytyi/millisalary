import { PointerEvent, RefObject, useRef } from 'react'

// A swipe starts within this distance of the page's left edge and becomes one
// once the finger has moved this far sideways, more across than down; until
// then the touch stays a tap or a scroll
const EDGE_WIDTH = 20
const SLOP = 8
// A released swipe closes the page past a third of its width, or from anywhere
// when the finger was still moving right faster than this (px/ms)
const CLOSE_FRACTION = 1 / 3
const CLOSE_VELOCITY = 0.5
// Speed is measured over the last moments before release only, so a finger
// that stopped before lifting counts as still
const VELOCITY_WINDOW_MS = 100
// The push/pop timing from index.css
const SETTLE = 'transform 0.35s var(--ease-ios)'

interface Sample {
  x: number
  t: number
}

interface Gesture {
  id: number
  // The page it started on: NavScreen stays mounted between opens, so a
  // gesture whose page closed under the finger never sees its pointerup
  page: HTMLDivElement
  startX: number
  startY: number
  dragging: boolean
  samples: Sample[]
}

const getAppScreen = () => document.querySelector<HTMLElement>('.app-screen')

/** Clears what the swipe left on the main screen once the page is gone */
export const resetAppScreen = () => {
  const app = getAppScreen()

  app?.style.removeProperty('transform')
  app?.style.removeProperty('opacity')
  app?.style.removeProperty('transition')
}

// iOS back swipe from the left edge, for the page's scroller (which keeps
// vertical pans with touch-action: pan-y): the page follows the finger and the
// main screen slides back from under it (index.css: -30% and 80% when
// covered). Styles go straight to the nodes, one per pointer move. On release
// the page either closes through `close` (which says no when the page wants to
// ask first) and the closing animation carries it on from where the finger
// left it, or settles back.
export const useEdgeSwipe = (
  pageRef: RefObject<HTMLDivElement | null>,
  close: () => boolean
) => {
  const gesture = useRef<Gesture | null>(null)

  const follow = (dx: number) => {
    const page = pageRef.current
    const app = getAppScreen()

    if (!page) {
      return
    }
    page.style.transform = `translateX(${dx}px)`
    // Under reduced motion the main screen doesn't move, so no parallax
    if (app && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const progress = Math.min(1, dx / page.offsetWidth)

      app.style.transform = `translateX(${-30 * (1 - progress)}%)`
      app.style.opacity = String(0.8 + 0.2 * progress)
    }
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const page = pageRef.current

    // A second finger on the same page is ignored; a gesture left over from
    // a page that has since closed is replaced
    if (gesture.current?.page === page || event.button !== 0 || !page) {
      return
    }
    if (event.clientX - page.getBoundingClientRect().left > EDGE_WIDTH) {
      return
    }
    gesture.current = {
      id: event.pointerId,
      page,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
      samples: [{ x: event.clientX, t: event.timeStamp }],
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current
    const page = pageRef.current

    if (!current || event.pointerId !== current.id || !page) {
      return
    }

    const dx = event.clientX - current.startX
    const dy = Math.abs(event.clientY - current.startY)

    if (!current.dragging) {
      if (dy > SLOP && dy >= dx) {
        gesture.current = null
        return
      }
      if (dx <= SLOP || dx <= dy) {
        return
      }
      // From here the finger owns the page: keep its moves even off the
      // scroller, and nothing eases while it drags
      current.dragging = true
      event.currentTarget.setPointerCapture(event.pointerId)
      page.style.transition = 'none'
      const app = getAppScreen()
      if (app) {
        app.style.transition = 'none'
      }
    }

    current.samples = [
      ...current.samples.filter(
        (sample) => event.timeStamp - sample.t <= VELOCITY_WINDOW_MS
      ),
      { x: event.clientX, t: event.timeStamp },
    ]
    follow(Math.max(0, dx))
  }

  const finish = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current
    const page = pageRef.current
    const app = getAppScreen()

    if (!current || event.pointerId !== current.id) {
      return
    }
    gesture.current = null
    if (!current.dragging || !page) {
      return
    }

    const last = current.samples[current.samples.length - 1]
    const end = { x: last.x, t: event.timeStamp }
    // The window ends at the release, not at the last move
    const recent = current.samples.filter(
      (sample) => end.t - sample.t <= VELOCITY_WINDOW_MS
    )
    const first = recent[0] ?? end
    const dx = Math.max(0, last.x - current.startX)
    const velocity = end.t > first.t ? (end.x - first.x) / (end.t - first.t) : 0
    const wantsClose =
      event.type === 'pointerup' &&
      dx > 0 &&
      (dx > page.offsetWidth * CLOSE_FRACTION || velocity > CLOSE_VELOCITY)

    if (app) {
      app.style.transition = ''
    }
    if (wantsClose && close()) {
      // The main screen finishes uncovering on its own transition; the page's
      // closing animation starts from its inline position
      if (app) {
        app.style.transform = 'none'
        app.style.opacity = '1'
      }
      return
    }

    page.style.transition = SETTLE
    page.style.transform = ''
    app?.style.removeProperty('transform')
    app?.style.removeProperty('opacity')
    page.addEventListener(
      'transitionend',
      () => page.style.removeProperty('transition'),
      { once: true }
    )
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: finish,
    onPointerCancel: finish,
  }
}
