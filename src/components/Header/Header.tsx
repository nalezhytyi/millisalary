import { ChartNoAxesColumn } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onSettingsClick: () => void
  /** Breakdown stays disabled until its sheet exists */
  onBreakdownClick?: () => void
}

const Header = ({ onSettingsClick, onBreakdownClick }: HeaderProps) => {
  return (
    <header className="flex w-full items-center justify-between gap-3 pt-[calc(0.5rem+env(safe-area-inset-top))] select-none">
      <Button
        variant="secondary"
        size="icon"
        className="size-11 rounded-full text-primary"
        onClick={onSettingsClick}
        aria-label="Open settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </Button>
      <div className="text-center">
        <h1 className="text-[17px] leading-tight font-semibold">Millisalary</h1>
        <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          Real time earnings
        </p>
      </div>
      <Button
        variant="secondary"
        size="icon"
        className="size-11 rounded-full text-primary"
        onClick={onBreakdownClick}
        disabled={!onBreakdownClick}
        aria-label="Open breakdown"
      >
        <ChartNoAxesColumn className="size-5" />
      </Button>
    </header>
  )
}

export default Header
