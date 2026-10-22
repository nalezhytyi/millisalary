import React from 'react'
import SegmentedControl from '@/components/SegmentedControl'
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

const PeriodTabs: React.FC<PeriodTabsProps> = ({ value, onChange }) => (
  <SegmentedControl
    aria-label="Earnings period"
    options={PERIODS}
    value={value}
    onChange={onChange}
  />
)

export default React.memo(PeriodTabs)
