import {
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeftSymbol } from '@/components/SFSymbol'
import { Button } from '@/components/ui/button'

export type NavCloseMethod = 'back_button' | 'escape' | 'history'

interface NavScreenProps {
  open: boolean
  onClose: (method: NavCloseMethod) => void
  /** Return false to keep the page open, e.g. to ask about unsaved changes */
  onBeforeClose?: () => boolean
  /** Open the page again when the browser goes forward to its entry */
  onReopen?: () => void
  title: string
  /** Trailing bar button, e.g. a save checkmark */
  action?: ReactNode
  children: ReactNode
}

// The page animation (index.css) takes 0.35 s; this timer only covers a missed
// animationend, e.g. in a hidden tab where animations don't run
const EXIT_FALLBACK_MS = 500

// A reload keeps history.state, but not the open page: forget the entry so the
// next open pushes a fresh one
if (window.history.state?.navScreen) {
  window.history.replaceState(null, '')
}

// The pages open right now, bottom to top. A page pushed from another page
// covers it: the covered page shifts back like the main screen does
// (data-covered in index.css) and can't be focused, and only the top page
// answers Esc
interface OpenPage {
  setCovered: (covered: boolean) => void
}

const openPages: OpenPage[] = []

// iOS 27 pushed page: slides in from the right over the main screen (or over
// the page it was pushed from), with a bar holding a round glass back chevron
// and the 17pt title. Rendered in a portal on <body> while open or closing so
// #root can be made inert without taking the page with it, and so nothing
// waits off-screen.
const NavScreen = ({
  open,
  onClose,
  onBeforeClose,
  onReopen,
  title,
  action,
  children,
}: NavScreenProps) => {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const returnFocusTo = useRef<HTMLElement | null>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const onCloseRef = useRef(onClose)
  const onBeforeCloseRef = useRef(onBeforeClose)
  const onReopenRef = useRef(onReopen)
  // Whether the history entry pushed on open is still there, and how the
  // close that called history.back() was asked for
  const hasHistoryEntry = useRef(false)
  const pendingMethod = useRef<NavCloseMethod | null>(null)
  // How many pages were open under this one when it opened (0 over the main
  // screen), and its place in openPages
  const depth = useRef(0)
  const openPage = useRef<OpenPage | null>(null)
  const titleId = useId()

  useEffect(() => {
    onCloseRef.current = onClose
    onBeforeCloseRef.current = onBeforeClose
    onReopenRef.current = onReopen
  })

  // Same render as the prop change, so the layer and its animation class are
  // there on the first frame
  if (open && !mounted) {
    setMounted(true)
  }
  if (open && closing) {
    setClosing(false)
  }
  if (!open && mounted && !closing) {
    setClosing(true)
  }

  const isOpen = open && mounted

  // ‹ and Esc: ask the page first, then leave through history so the entry
  // pushed on open goes too; popstate does the actual close
  const requestClose = useCallback((method: NavCloseMethod) => {
    // A second tap before popstate would go one entry too far back
    if (pendingMethod.current !== null) {
      return
    }
    if (onBeforeCloseRef.current?.() === false) {
      return
    }
    if (hasHistoryEntry.current) {
      pendingMethod.current = method
      window.history.back()
    } else {
      onCloseRef.current(method)
    }
  }, [])

  // The main screen slides left (index.css) and cannot be focused or read
  // while the page is up, and so does a page this one was pushed from; both
  // end as soon as the page starts to leave. The covered page is set
  // directly, so it is focusable again before focus returns to it
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const root = document.getElementById('root')
    const page: OpenPage = {
      setCovered: (covered) => {
        const layer = layerRef.current

        if (layer) {
          layer.inert = covered
          layer.toggleAttribute('data-covered', covered)
        }
      },
    }

    returnFocusTo.current = document.activeElement as HTMLElement | null
    // data-nav-instant names the one transition the browser already animated
    // (see popstate below); any other open slides as usual
    if (document.documentElement.dataset.navInstant !== 'open') {
      delete document.documentElement.dataset.navInstant
    }
    depth.current = openPages.length
    openPages.at(-1)?.setCovered(true)
    openPages.push(page)
    openPage.current = page
    document.documentElement.dataset.navScreen = 'open'
    if (root) {
      root.inert = true
    }
    titleRef.current?.focus({ preventScroll: true })

    return () => {
      const index = openPages.indexOf(page)

      openPages.splice(index, 1)
      if (index === openPages.length) {
        openPages.at(-1)?.setCovered(false)
      }
      if (document.documentElement.dataset.navInstant !== 'close') {
        delete document.documentElement.dataset.navInstant
      }
      if (openPages.length === 0) {
        delete document.documentElement.dataset.navScreen
        if (root) {
          root.inert = false
        }
      }
      returnFocusTo.current?.focus({ preventScroll: true })
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    // A sheet or alert above the page closes on the same Esc first (Radix
    // listens in the capture phase and marks the event handled)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'Escape' &&
        !event.defaultPrevented &&
        openPages.at(-1) === openPage.current
      ) {
        requestClose('escape')
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, requestClose])

  // The page is a history entry, keyed by its title and depth, so the
  // browser's and Android's back close it like ‹ does. Pushing only when the
  // current entry isn't this page's keeps StrictMode's second mount, and a
  // page reopened by going forward, from adding another one
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const entry = { navScreen: title, navDepth: depth.current }

    if (window.history.state?.navScreen !== title) {
      window.history.pushState(entry, '')
    }
    hasHistoryEntry.current = true

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state
      const stateDepth = state?.navDepth ?? 0

      // Back from a page pushed on top of this one lands on this page's
      // entry, and going forward again lands above it: this page stays
      if (
        state?.navScreen &&
        (stateDepth > depth.current ||
          (stateDepth === depth.current && state.navScreen === title))
      ) {
        return
      }

      const method = pendingMethod.current ?? 'history'
      const fromBrowser = pendingMethod.current === null

      pendingMethod.current = null
      // ‹ and Esc asked onBeforeClose already; a browser back can't be
      // cancelled, so put the entry back while the page asks
      if (fromBrowser && onBeforeCloseRef.current?.() === false) {
        window.history.pushState(entry, '')
        return
      }
      hasHistoryEntry.current = false
      // A back swipe in Safari or an iOS web app has already slid the page
      // away (hasUAVisualTransition), so drop it at once instead of playing
      // our slide-out on top, and put the main screen back without its
      // transition (index.css, nav-instant). The flag stays until the next
      // open or close sets or clears it
      if (event.hasUAVisualTransition) {
        document.documentElement.dataset.navInstant = 'close'
        setMounted(false)
      } else {
        delete document.documentElement.dataset.navInstant
      }
      onCloseRef.current(method)
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [isOpen, title])

  // Going forward again onto this page's entry after it closed (Safari's
  // forward swipe) shows the page in the browser's transition, so open it;
  // after the browser's own animation it appears without the slide-in
  useEffect(() => {
    if (isOpen) {
      return
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.navScreen !== title || !onReopenRef.current) {
        return
      }
      if (event.hasUAVisualTransition) {
        document.documentElement.dataset.navInstant = 'open'
      }
      onReopenRef.current()
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [isOpen, title])

  // Closed from inside (save, discard): drop the entry it pushed. The
  // popstate listener is already gone, so this back closes nothing else
  useEffect(() => {
    if (!open && hasHistoryEntry.current) {
      hasHistoryEntry.current = false
      window.history.back()
    }
  }, [open])

  // In an iOS home-screen app the keyboard covers the page without resizing
  // it, and WebKit left a field near the bottom hidden behind the keyboard.
  // The visual viewport does shrink, so pad the scroller by the covered part
  // and bring the focused field to the middle of what is left
  useEffect(() => {
    const viewport = window.visualViewport

    if (!isOpen || !viewport) {
      return
    }

    const handleResize = () => {
      const page = pageRef.current
      const keyboardInset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop
      )
      const focused = document.activeElement

      page?.style.setProperty('--keyboard-inset', `${keyboardInset}px`)
      if (
        keyboardInset > 0 &&
        focused instanceof HTMLElement &&
        page?.contains(focused) &&
        focused.matches('input, textarea')
      ) {
        focused.scrollIntoView({ block: 'center' })
      }
    }

    viewport.addEventListener('resize', handleResize)

    return () => viewport.removeEventListener('resize', handleResize)
  }, [isOpen])

  useEffect(() => {
    if (!closing) {
      return
    }

    const timer = setTimeout(() => {
      setMounted(false)
      setClosing(false)
    }, EXIT_FALLBACK_MS)

    return () => clearTimeout(timer)
  }, [closing])

  if (!mounted) {
    return null
  }

  return createPortal(
    <div
      ref={layerRef}
      className="nav-screen-layer fixed inset-0 z-50 overflow-hidden"
      data-closing={closing ? '' : undefined}
      onAnimationEnd={(event) => {
        if (closing && event.target === event.currentTarget.lastElementChild) {
          setMounted(false)
          setClosing(false)
        }
      }}
    >
      <div
        ref={pageRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="nav-screen-page absolute inset-0 bg-background"
      >
        {/* The bar floats over the scrolling content with the iOS 27 scroll
            edge effect (nav-scroll-edge in index.css) instead of a solid
            background and a hairline */}
        <div className="nav-scroll-edge absolute inset-x-0 top-0 z-10 pt-[env(safe-area-inset-top)]">
          {/* The buttons sit 8pt below the safe area like the main screen's
              header buttons, so they don't jump on the push, with the kit's
              10pt under them: 8 + 44 + 10 = 62pt */}
          <div className="mx-auto grid h-[62px] w-full max-w-md grid-cols-[1fr_auto_1fr] items-start px-4 pt-2">
            <Button
              variant="glass"
              size="icon"
              onClick={() => requestClose('back_button')}
              aria-label="Back"
            >
              <ChevronLeftSymbol />
            </Button>
            <h1
              id={titleId}
              ref={titleRef}
              tabIndex={-1}
              className="text-headline leading-11 font-semibold outline-none"
            >
              {title}
            </h1>
            <div className="justify-self-end">{action}</div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-y-auto overscroll-contain">
          {/* Content starts 8pt below the bar, so a card doesn't sit right
              under the buttons; it scrolls on under the bar */}
          <div className="mx-auto w-full max-w-md px-4 pt-[calc(env(safe-area-inset-top)+70px)] pb-[calc(1.5rem+env(safe-area-inset-bottom)+var(--keyboard-inset,0px))]">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default NavScreen
