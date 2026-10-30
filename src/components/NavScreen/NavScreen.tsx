import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeftSymbol } from '@/components/SFSymbol'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { resetAppScreen, useEdgeSwipe } from './useEdgeSwipe'

export type NavCloseMethod = 'back_button' | 'escape' | 'history' | 'swipe'

interface NavScreenProps {
  open: boolean
  onClose: (method: NavCloseMethod) => void
  /** Return false to keep the page open, e.g. to ask about unsaved changes */
  onBeforeClose?: () => boolean
  title: string
  /** Trailing bar button, e.g. a save checkmark */
  action?: ReactNode
  children: ReactNode
}

// The page animation (index.css) takes 0.35 s; this timer only covers a missed
// animationend, e.g. in a hidden tab where animations don't run
const EXIT_FALLBACK_MS = 500

// The edge swipe is only ours in the installed iOS app: a Safari tab has its
// own back swipe, and Android its system back, both of which reach the page
// through history (popstate)
const hasEdgeSwipe = () =>
  document.documentElement.classList.contains('ios-standalone')

// A reload keeps history.state, but not the open page: forget the entry so the
// next open pushes a fresh one
if (window.history.state?.navScreen) {
  window.history.replaceState(null, '')
}

// iOS 27 pushed page: slides in from the right over the main screen, with a
// bar holding a round glass back chevron and the 17pt title. Rendered in a
// portal on <body>
// while open or closing so #root can be made inert without taking the page
// with it, and so nothing waits off-screen.
const NavScreen = ({
  open,
  onClose,
  onBeforeClose,
  title,
  action,
  children,
}: NavScreenProps) => {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const returnFocusTo = useRef<HTMLElement | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const onCloseRef = useRef(onClose)
  const onBeforeCloseRef = useRef(onBeforeClose)
  // Whether the history entry pushed on open is still there, and how the
  // close that called history.back() was asked for
  const hasHistoryEntry = useRef(false)
  const pendingMethod = useRef<NavCloseMethod | null>(null)

  useEffect(() => {
    onCloseRef.current = onClose
    onBeforeCloseRef.current = onBeforeClose
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

  // ‹, Esc and the swipe: ask the page first, then leave through history so
  // the entry pushed on open goes too; popstate does the actual close. Returns
  // whether the page is closing
  const requestClose = useCallback((method: NavCloseMethod) => {
    // A second tap before popstate would go one entry too far back
    if (pendingMethod.current !== null) {
      return false
    }
    if (onBeforeCloseRef.current?.() === false) {
      return false
    }
    if (hasHistoryEntry.current) {
      pendingMethod.current = method
      window.history.back()
    } else {
      onCloseRef.current(method)
    }
    return true
  }, [])
  const edgeSwipe = useEdgeSwipe(pageRef, () => requestClose('swipe'))

  // The main screen slides left (index.css) and cannot be focused or read
  // while the page is up; both end as soon as the page starts to leave
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const root = document.getElementById('root')

    returnFocusTo.current = document.activeElement as HTMLElement | null
    document.documentElement.dataset.navScreen = 'open'
    if (root) {
      root.inert = true
    }
    titleRef.current?.focus({ preventScroll: true })

    return () => {
      delete document.documentElement.dataset.navScreen
      resetAppScreen()
      if (root) {
        root.inert = false
      }
      returnFocusTo.current?.focus({ preventScroll: true })
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        requestClose('escape')
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, requestClose])

  // The page is a history entry, so the browser's and Android's back close it
  // like ‹ does. Pushing only when the current entry isn't ours keeps
  // StrictMode's second mount from adding another one
  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (!window.history.state?.navScreen) {
      window.history.pushState({ navScreen: true }, '')
    }
    hasHistoryEntry.current = true

    const handlePopState = () => {
      const method = pendingMethod.current ?? 'history'
      const fromBrowser = pendingMethod.current === null

      pendingMethod.current = null
      // ‹ and Esc asked onBeforeClose already; a browser back can't be
      // cancelled, so put the entry back while the page asks
      if (fromBrowser && onBeforeCloseRef.current?.() === false) {
        window.history.pushState({ navScreen: true }, '')
        return
      }
      hasHistoryEntry.current = false
      onCloseRef.current(method)
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [isOpen])

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
        aria-labelledby="nav-screen-title"
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
              id="nav-screen-title"
              ref={titleRef}
              tabIndex={-1}
              className="text-headline leading-11 font-semibold outline-none"
            >
              {title}
            </h1>
            <div className="justify-self-end">{action}</div>
          </div>
        </div>
        {/* The edge swipe lives on the scroller, which only gives up
            horizontal pans (touch-action: pan-y); the bar above keeps ‹ */}
        <div
          className={cn(
            'absolute inset-0 overflow-y-auto overscroll-contain',
            hasEdgeSwipe() && 'touch-pan-y'
          )}
          {...(hasEdgeSwipe() ? edgeSwipe : {})}
        >
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
