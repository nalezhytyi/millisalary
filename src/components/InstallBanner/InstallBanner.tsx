import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InstallBannerProps {
  onInstall: () => void
  onDismiss: () => void
}

// Floats over the header in a phone's browser tab (never in the installed
// app), above the main screen and under the sheets (z-50), which dim it.
// Offset with top, not padding: Safari tints the status bar from a fixed box
// found 4px inside the top edge, which painted it the card's color.
const InstallBanner = ({ onInstall, onDismiss }: InstallBannerProps) => (
  <div className="pointer-events-none fixed inset-x-0 top-[calc(0.5rem+env(safe-area-inset-top))] z-40 mx-auto w-full max-w-md px-3">
    <aside
      aria-label="Install the app"
      className="pointer-events-auto flex animate-in items-center gap-3 rounded-2xl bg-card py-2.5 pr-3 pl-1.5 shadow-lg ring-1 ring-black/5 duration-300 fade-in slide-in-from-top-2 motion-reduce:animate-none dark:ring-white/10"
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground"
      >
        <X className="size-4" />
      </button>
      <img
        src={`${import.meta.env.BASE_URL}apple-touch-icon.png`}
        alt=""
        className="size-10 shrink-0 rounded-[10px]"
        draggable={false}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] leading-tight font-semibold">Millisalary</p>
        <p className="truncate text-[13px] text-muted-foreground">
          Add to Home Screen
        </p>
      </div>
      <Button onClick={onInstall}>Install</Button>
    </aside>
  </div>
)

export default InstallBanner
