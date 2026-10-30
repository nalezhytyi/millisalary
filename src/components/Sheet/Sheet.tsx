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

// The iOS 27 kit's large sheet ("Sheet - iPhone", Large): it starts at the
// top safe area (62pt on an iPhone 17 Pro, so the dimmed page shows above it)
// and runs to the bottom edge with 38pt top corners; a 6pt grabber area, then
// a toolbar row with a glass close button 16pt in from the corner and the
// centered title, then a scrolling body
const Sheet = ({ open, onClose, title, description, children }: SheetProps) => (
  <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
    {/* Capped to the same centered max-w-md column as the main screen, so on
        wide screens it rises over the app instead of spanning the window;
        without a top inset (a browser tab, desktop) it keeps 12pt clear */}
    <DrawerContent className="mx-auto max-w-md bg-background data-[vaul-drawer-direction=bottom]:top-[max(env(safe-area-inset-top),0.75rem)] data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-none data-[vaul-drawer-direction=bottom]:rounded-t-[38px] data-[vaul-drawer-direction=bottom]:border-0">
      {/* 16pt above the 44pt button row and 10pt below it */}
      <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center px-4 pt-4 pb-2.5">
        <DrawerClose asChild>
          <Button variant="glass" size="icon" aria-label="Close">
            <XmarkSymbol />
          </Button>
        </DrawerClose>
        {/* The kit sets the title 2pt below the buttons' centre */}
        <DrawerTitle className="translate-y-0.5 text-headline font-semibold">
          {title}
        </DrawerTitle>
        <span />
      </div>
      <DrawerDescription className="sr-only">{description}</DrawerDescription>

      {/* The sheet reaches the screen bottom, so the body clears the home
          indicator */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        {children}
      </div>
    </DrawerContent>
  </Drawer>
)

export default Sheet
