import { RadioGroup } from 'radix-ui'

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  'aria-label'?: string
}

// Styled after UISegmentedControl: grey track, raised selected segment. A
// radio group, not tabs (there are no panels), so arrow keys move the
// selection like a native segmented control.
const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) => (
  <RadioGroup.Root
    value={value}
    onValueChange={(next) => onChange(next as T)}
    orientation="horizontal"
    aria-label={ariaLabel}
    className="flex h-9 w-full items-center rounded-[9px] bg-muted p-0.5"
  >
    {options.map((option) => (
      <RadioGroup.Item
        key={option.value}
        value={option.value}
        className="h-full flex-1 rounded-[7px] text-[13px] font-medium text-foreground/60 transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=checked]:bg-card data-[state=checked]:text-foreground data-[state=checked]:shadow-sm dark:text-muted-foreground dark:data-[state=checked]:bg-[#636366] dark:data-[state=checked]:text-foreground"
      >
        {option.label}
      </RadioGroup.Item>
    ))}
  </RadioGroup.Root>
)

export default SegmentedControl
