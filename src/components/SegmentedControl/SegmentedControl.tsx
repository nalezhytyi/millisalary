import { RadioGroup } from 'radix-ui'
import './SegmentedControl.css'

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  'aria-label'?: string
}

// Styled after the iOS 27 UISegmentedControl, at the size of the Photos one:
// a 47pt glass capsule track (SegmentedControl.css) with 17pt labels and one
// thumb that slides to the selected segment on the snappy spring; the
// selected label turns semibold. Under a finger the whole control swells a
// little and eases back on release, on the same easing as the buttons; its
// labels can't be selected or long-pressed into a callout. A radio group,
// not tabs (there are no panels), so arrow keys move the selection like a
// native segmented control.
const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) => {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  )

  return (
    <RadioGroup.Root
      value={value}
      onValueChange={(next) => onChange(next as T)}
      orientation="horizontal"
      aria-label={ariaLabel}
      className="segmented-track relative flex h-[47px] w-full items-center overflow-hidden rounded-full p-1 transition-[scale] duration-600 ease-[cubic-bezier(0.25,0.1,0.25,1)] select-none [-webkit-touch-callout:none] active:scale-[1.04] active:duration-450 motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      {/* 4pt inset all round; translateX is relative to the thumb's own width,
          so one segment per step. The spring overshoots, so the track clips
          the thumb at its ends instead of letting it fly out */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-1 left-1 rounded-full bg-segment-selected shadow-[0_3px_8px_rgb(0_0_0/12%),0_3px_1px_rgb(0_0_0/4%)] transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
        style={{
          width: `calc((100% - 8px) / ${options.length})`,
          transform: `translateX(${selectedIndex * 100}%)`,
        }}
      />
      {options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className="relative z-10 h-full flex-1 rounded-full text-body text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=checked]:font-semibold"
        >
          {option.label}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}

export default SegmentedControl
