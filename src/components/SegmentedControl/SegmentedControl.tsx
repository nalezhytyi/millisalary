import { RadioGroup } from 'radix-ui'

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  'aria-label'?: string
}

// Styled after the iOS 27 UISegmentedControl: a 32pt capsule track with one
// thumb that slides to the selected segment on the snappy spring; the
// selected label turns semibold. A radio group, not tabs (there are no
// panels), so arrow keys move the selection like a native segmented control.
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
      className="relative flex h-8 w-full items-center rounded-full bg-fill-tertiary p-0.5"
    >
      {/* 2pt inset all round; translateX is relative to the thumb's own width,
          so one segment per step */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0.5 left-0.5 rounded-full bg-segment-selected shadow-[0_3px_8px_rgb(0_0_0/12%),0_3px_1px_rgb(0_0_0/4%)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
        style={{
          width: `calc((100% - 4px) / ${options.length})`,
          transform: `translateX(${selectedIndex * 100}%)`,
        }}
      />
      {options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className="relative z-10 h-full flex-1 rounded-full text-footnote text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=checked]:font-semibold"
        >
          {option.label}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}

export default SegmentedControl
