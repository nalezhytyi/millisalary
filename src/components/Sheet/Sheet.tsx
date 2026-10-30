import { ReactNode } from 'react'
import { Check } from 'lucide-react'
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
  repositionInputs?: boolean
  children: ReactNode
}

// iOS-style page sheet: grabber, centered title with a trailing Done button
// and a scrolling body
const Sheet = ({
  open,
  onClose,
  title,
  description,
  repositionInputs,
  children,
}: SheetProps) => (
  <Drawer
    open={open}
    onOpenChange={(next) => !next && onClose()}
    repositionInputs={repositionInputs}
  >
    {/* Same centered max-w-md column as the main screen, so on wide screens
        the sheet opens over the app instead of spanning the window; side
        borders mark its edges there (a black sheet on a black page in dark) */}
    <DrawerContent className="mx-auto h-[94dvh] w-full max-w-md bg-background data-[vaul-drawer-direction=bottom]:max-h-[94dvh] data-[vaul-drawer-direction=bottom]:rounded-t-[38px] min-[28rem]:border-x">
      {/* 54pt title bar: the 44pt button item plus 5pt above and below */}
      <div className="grid h-[54px] shrink-0 grid-cols-[1fr_auto_1fr] items-center px-4 py-[5px]">
        <span />
        <DrawerTitle className="text-headline font-semibold">
          {title}
        </DrawerTitle>
        <DrawerClose asChild>
          <Button size="icon" className="justify-self-end" aria-label="Done">
            <Check strokeWidth={2.5} />
          </Button>
        </DrawerClose>
      </div>
      <DrawerDescription className="sr-only">{description}</DrawerDescription>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        {children}
      </div>
    </DrawerContent>
  </Drawer>
)

export default Sheet
