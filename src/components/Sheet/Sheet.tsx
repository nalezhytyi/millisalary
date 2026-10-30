import { ReactNode } from 'react'
import { XmarkSymbol } from '@/components/SFSymbol'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/components/ui/drawer'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  /** Screen-reader description of the sheet */
  description: string
  children: ReactNode
}

// The iOS 27 kit's medium sheet ("Sheet - iPhone", Medium): a card floating
// 6pt in from the screen edges with 34pt top and 58pt bottom corners, sized
// to its content; a 16pt grabber area, then a toolbar row with a glass close
// button on the left and the centered title, then a scrolling body
const Sheet = ({ open, onClose, title, description, children }: SheetProps) => (
  <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
    {/* Capped to the same centered max-w-md column as the main screen, so on
        wide screens it floats over the app instead of spanning the window */}
    <DrawerContent className="mx-auto max-w-[calc(28rem-12px)] bg-background data-[vaul-drawer-direction=bottom]:inset-x-1.5 data-[vaul-drawer-direction=bottom]:bottom-1.5 data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-[calc(100dvh-env(safe-area-inset-top)-1.5rem)] data-[vaul-drawer-direction=bottom]:rounded-t-[34px] data-[vaul-drawer-direction=bottom]:rounded-b-[58px] data-[vaul-drawer-direction=bottom]:border-0">
      {/* 16pt grabber area, then the 44pt button row and 10pt below it */}
      <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center px-4 pt-4 pb-2.5">
        <DrawerClose asChild>
          <Button variant="glass" size="icon" aria-label="Close">
            <XmarkSymbol />
          </Button>
        </DrawerClose>
        <DrawerTitle className="text-headline font-semibold">
          {title}
        </DrawerTitle>
        <span />
      </div>
      <DrawerDescription className="sr-only">{description}</DrawerDescription>

      {/* The card ends 6pt above the screen edge, over the home indicator, and
          its 58pt bottom corners need room */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-[max(2rem,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </DrawerContent>
  </Drawer>
)

export default Sheet
