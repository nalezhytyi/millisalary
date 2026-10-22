import { ToggleGroup } from 'radix-ui'

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  'aria-label'?: string
}

// Styled after UISegmentedControl: grey track, raised selected segment. A
// single-choice toggle group (radio semantics), not tabs: there are no panels.
const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) => (
  <ToggleGroup.Root
    type="single"
    value={value}
    // Radix reports '' when the active segment is pressed again; keep it
    onValueChange={(next) => next && onChange(next as T)}
    aria-label={ariaLabel}
    className="flex h-9 w-full items-center rounded-[9px] bg-muted p-0.5"
  >
    {options.map((option) => (
      <ToggleGroup.Item
        key={option.value}
        value={option.value}
        className="h-full flex-1 rounded-[7px] text-[13px] font-medium text-foreground/60 transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-sm dark:text-muted-foreground dark:data-[state=on]:bg-[#636366] dark:data-[state=on]:text-foreground"
      >
        {option.label}
      </ToggleGroup.Item>
    ))}
  </ToggleGroup.Root>
)

export default SegmentedControl
