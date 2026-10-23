import { ReactNode } from 'react'
import { Share, SquarePlus, TextAlignStart } from 'lucide-react'
import ListGroup from '@/components/ListGroup'
import Sheet from '@/components/Sheet'

interface InstallSheetProps {
  open: boolean
  onClose: () => void
}

// Safari 26 moved Share into the menu next to the address and added the
// "Open as Web App" switch. The UA string is frozen at iOS 18, but Safari 26
// also shipped scroll-driven animations, which tells the two apart.
const isSafari26 =
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()')

// Inline stand-in for the Safari control a step refers to
const Glyph = ({ children }: { children: ReactNode }) => (
  <span className="mx-0.5 inline-flex size-6 items-center justify-center rounded-md bg-secondary align-[-0.35em] text-primary">
    {children}
  </span>
)

const STEPS: ReactNode[] = isSafari26
  ? [
      <>
        Tap{' '}
        <Glyph>
          <TextAlignStart className="size-4" />
        </Glyph>{' '}
        next to the address, then <b>Share</b>{' '}
        <Glyph>
          <Share className="size-4" />
        </Glyph>
      </>,
      <>
        Scroll down and tap <b>Add to Home Screen</b>{' '}
        <Glyph>
          <SquarePlus className="size-4" />
        </Glyph>
      </>,
      <>
        Keep <b>Open as Web App</b> on and tap <b>Add</b>
      </>,
    ]
  : [
      <>
        Tap <b>Share</b>{' '}
        <Glyph>
          <Share className="size-4" />
        </Glyph>{' '}
        in the toolbar
      </>,
      <>
        Scroll down and tap <b>Add to Home Screen</b>{' '}
        <Glyph>
          <SquarePlus className="size-4" />
        </Glyph>
      </>,
      <>
        Tap <b>Add</b>
      </>,
    ]

// iPhone only: a page can't add itself to the Home Screen there, so the
// banner's Install button opens Safari's steps instead
const InstallSheet = ({ open, onClose }: InstallSheetProps) => (
  <Sheet
    open={open}
    onClose={onClose}
    title="Install"
    description="How to add Millisalary to your Home Screen from Safari"
  >
    <section className="mb-6 flex flex-col items-center gap-2 pt-2 text-center">
      <img
        src={`${import.meta.env.BASE_URL}apple-touch-icon.png`}
        alt=""
        className="size-16 rounded-[14px]"
        draggable={false}
      />
      <h2 className="text-[20px] leading-tight font-semibold">
        Add Millisalary to your Home Screen
      </h2>
      <p className="max-w-72 text-[15px] text-muted-foreground">
        It opens full screen, like a regular app, and keeps working offline.
      </p>
    </section>

    <ListGroup
      title="In Safari"
      footer="Only Safari can add web apps to the Home Screen; in other apps open this page in Safari first."
    >
      {STEPS.map((step, index) => (
        <div
          key={index}
          className="relative flex items-center gap-3 px-4 py-3 after:absolute after:right-0 after:bottom-0 after:left-14 after:h-px after:bg-border last:after:hidden"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[15px] font-semibold text-primary-foreground">
            {index + 1}
          </span>
          <p className="text-[17px] leading-snug">{step}</p>
        </div>
      ))}
    </ListGroup>
  </Sheet>
)

export default InstallSheet
