import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavScreenProps {
  open: boolean
  onClose: () => void
  title: string
  /** Trailing bar button, e.g. a save checkmark */
  action?: ReactNode
  children: ReactNode
}

// The page animation (index.css) takes 0.35 s; this timer only covers a missed
// animationend, e.g. in a hidden tab where animations don't run
const EXIT_FALLBACK_MS = 500

// Scroll distance over which the large title hands over to the bar title
const COLLAPSE_START = 24
const COLLAPSE_RANGE = 24

// iOS 27 pushed page: slides in from the right over the main screen, 54pt bar
// with a round glass back chevron, and a 34pt large title that collapses into
// the bar's 17pt title as the content scrolls. Rendered in a portal on <body>
// while open or closing so #root can be made inert without taking the page
// with it, and so nothing waits off-screen.
const NavScreen = ({
  open,
  onClose,
  title,
  action,
  children,
}: NavScreenProps) => {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const returnFocusTo = useRef<HTMLElement | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const barTitleRef = useRef<HTMLSpanElement>(null)
  const barEdgeRef = useRef<HTMLDivElement>(null)

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
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

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

  // Style updates go straight to the nodes: a re-render per scroll event
  // would be wasted work for two opacity values
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget
    const collapse = Math.min(
      1,
      Math.max(0, (scrollTop - COLLAPSE_START) / COLLAPSE_RANGE)
    )

    if (barTitleRef.current) {
      barTitleRef.current.style.opacity = String(collapse)
    }
    if (barEdgeRef.current) {
      barEdgeRef.current.style.opacity = scrollTop > 1 ? '1' : '0'
    }
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
        className="nav-screen-page absolute inset-0 flex flex-col bg-background"
      >
        <div className="relative shrink-0 bg-background pt-[env(safe-area-inset-top)]">
          {/* The back button sits 8pt below the safe area like the main
              screen's header buttons, so it doesn't jump on the push; the
              bar stays 54pt */}
          <div className="mx-auto grid h-[54px] w-full max-w-md grid-cols-[1fr_auto_1fr] items-start px-4 pt-2">
            <Button
              variant="glass"
              size="icon"
              onClick={onClose}
              aria-label="Back"
            >
              <ChevronLeft strokeWidth={2.5} />
            </Button>
            <span
              ref={barTitleRef}
              aria-hidden
              className="text-headline leading-11 font-semibold opacity-0"
            >
              {title}
            </span>
            <div className="justify-self-end">{action}</div>
          </div>
          <div
            ref={barEdgeRef}
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[0.5px] bg-border opacity-0 transition-opacity"
          />
        </div>
        <div
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          <div className="mx-auto w-full max-w-md px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom)+var(--keyboard-inset,0px))]">
            <h1
              id="nav-screen-title"
              ref={titleRef}
              tabIndex={-1}
              className="pt-2 pb-2.5 text-large-title font-bold outline-none"
            >
              {title}
            </h1>
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default NavScreen
