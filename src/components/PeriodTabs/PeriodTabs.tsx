import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Period } from '@/utils/calculations'

interface PeriodTabsProps {
  value: Period
  onChange: (period: Period) => void
}

const PERIODS: { value: Period; label: string }[] = [
  { value: 'hour', label: 'Hour' },
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

// Styled after UISegmentedControl: grey track, raised selected segment
const PeriodTabs: React.FC<PeriodTabsProps> = ({ value, onChange }) => (
  <Tabs value={value} onValueChange={(next) => onChange(next as Period)}>
    <TabsList className="h-9 w-full rounded-[9px] p-0.5">
      {PERIODS.map((period) => (
        <TabsTrigger
          key={period.value}
          value={period.value}
          className="rounded-[7px] text-[13px] font-medium data-active:bg-card data-active:shadow-sm dark:data-active:border-transparent dark:data-active:bg-[#636366]"
        >
          {period.label}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
)

export default React.memo(PeriodTabs)
