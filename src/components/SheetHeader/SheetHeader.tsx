import { Button } from '@/components/ui/button'
import { DrawerClose, DrawerTitle } from '@/components/ui/drawer'

// Centered title with a trailing Done button, like a UIKit sheet navigation bar
const SheetHeader = ({ title }: { title: string }) => (
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
)

export default SheetHeader
