import { Button } from '@/components/ui/button'

interface SetupHintProps {
  onOpenSettings: () => void
}

const SetupHint = ({ onOpenSettings }: SetupHintProps) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-4 py-4 text-center">
    <p className="text-[15px] text-muted-foreground">
      Add your monthly salary to start tracking earnings.
    </p>
    <Button onClick={onOpenSettings}>Open settings</Button>
  </div>
)

export default SetupHint
