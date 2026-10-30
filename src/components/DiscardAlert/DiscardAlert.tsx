import { AlertDialog } from 'radix-ui'
import { Button } from '@/components/ui/button'

interface DiscardAlertProps {
  open: boolean
  onKeepEditing: () => void
  onDiscard: () => void
}

// iOS 27 alert: 300pt wide, 34pt corners, 14pt padding, two 48pt pill buttons
// 8pt apart; the cancel button is regular in the label color, the destructive
// one semibold red, over the kit's alert overlay. Solid, not glass: glass is kept to the header buttons, the back
// chevron and the install banner. Above the pushed screen (z-50).
const DiscardAlert = ({
  open,
  onKeepEditing,
  onDiscard,
}: DiscardAlertProps) => (
  <AlertDialog.Root
    open={open}
    onOpenChange={(next) => !next && onKeepEditing()}
  >
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="fixed inset-0 z-[60] bg-overlay-alert data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <AlertDialog.Content className="fixed top-1/2 left-1/2 z-[60] w-[300px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-[34px] bg-popover p-3.5 text-popover-foreground outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
        <div className="px-2 pt-2 pb-6 text-center">
          <AlertDialog.Title className="text-headline font-semibold">
            Discard changes?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2.5 text-footnote text-muted-foreground">
            Your changes to the settings haven&apos;t been saved.
          </AlertDialog.Description>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <AlertDialog.Cancel asChild>
            <Button
              variant="bordered"
              size="large"
              className="h-12 px-4 text-callout font-normal text-foreground"
            >
              Keep Editing
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button
              variant="destructive"
              size="large"
              className="h-12 px-4 text-callout"
              onClick={onDiscard}
            >
              Discard
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
)

export default DiscardAlert
