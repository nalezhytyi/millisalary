import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  'aria-label'?: string
}

// Styled after UISegmentedControl: grey track, raised selected segment
const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) => (
  <Tabs value={value} onValueChange={(next) => onChange(next as T)}>
    <TabsList
      aria-label={ariaLabel}
      className="h-9 w-full rounded-[9px] p-0.5"
    >
      {options.map((option) => (
        <TabsTrigger
          key={option.value}
          value={option.value}
          className="rounded-[7px] text-[13px] font-medium data-active:bg-card data-active:shadow-sm dark:data-active:border-transparent dark:data-active:bg-[#636366]"
        >
          {option.label}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
)

export default SegmentedControl
