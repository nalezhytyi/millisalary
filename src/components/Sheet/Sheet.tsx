import { ReactNode } from 'react'
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
    <DrawerContent className="h-[94dvh] bg-background data-[vaul-drawer-direction=bottom]:max-h-[94dvh] data-[vaul-drawer-direction=bottom]:rounded-t-[14px]">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 pt-2 pb-2">
        <span />
        <DrawerTitle className="text-[17px] font-semibold">{title}</DrawerTitle>
        <DrawerClose asChild>
          <Button
            variant="ghost"
            className="h-9 justify-self-end px-2 text-[17px] font-semibold text-primary hover:bg-transparent"
          >
            Done
          </Button>
        </DrawerClose>
      </div>
      <DrawerDescription className="sr-only">{description}</DrawerDescription>

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        {children}
      </div>
    </DrawerContent>
  </Drawer>
)

export default Sheet
