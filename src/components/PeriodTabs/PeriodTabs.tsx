import React from 'react'
import SegmentedControl from '@/components/SegmentedControl'
import { PERIODS, type Period } from '@/utils/calculations'

interface PeriodTabsProps {
  value: Period
  onChange: (period: Period) => void
}

const PERIOD_LABELS: Record<Period, string> = {
  hour: 'Hour',
  day: 'Day',
  week: 'Week',
  month: 'Month',
  year: 'Year',
}

const PERIOD_OPTIONS = PERIODS.map((period) => ({
  value: period,
  label: PERIOD_LABELS[period],
}))

const PeriodTabs: React.FC<PeriodTabsProps> = ({ value, onChange }) => (
  <SegmentedControl
    aria-label="Earnings period"
    options={PERIOD_OPTIONS}
    value={value}
    onChange={onChange}
  />
)

export default React.memo(PeriodTabs)
