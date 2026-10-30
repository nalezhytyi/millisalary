import React from 'react'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/utils/calculations'
import type { EarningsSnapshot } from '@/utils/calculations'

interface StatsRowProps {
  earnings: EarningsSnapshot
  currency: string
}

const StatsRow: React.FC<StatsRowProps> = ({ earnings, currency }) => {
  const stats = [
    { label: 'Today', amount: earnings.day.earned },
    { label: 'This week', amount: earnings.week.earned },
    { label: 'This month', amount: earnings.month.earned },
  ]

  return (
    <div className="flex items-stretch">
      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          {index > 0 && <Separator orientation="vertical" />}
          <div className="min-w-0 flex-1 px-1 text-center">
            <div className="text-footnote font-semibold [overflow-wrap:anywhere]">
              {formatCurrency(stat.amount, currency)}
            </div>
            <div className="mt-0.5 text-caption1 text-muted-foreground">
              {stat.label}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

export default React.memo(StatsRow)
