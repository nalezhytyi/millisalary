import React from 'react'
import dayjs from 'dayjs'
import ListGroup from '@/components/ListGroup'
import ListRow from '@/components/ListRow'
import Sheet from '@/components/Sheet'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/utils/calculations'
import type { EarningsSnapshot } from '@/utils/calculations'

interface BreakdownSheetProps {
  open: boolean
  onClose: () => void
  earnings: EarningsSnapshot
  currency: string
  monthlySalaryCurrency: string
  exchangeRate: number
}

const EARNED_ROWS = [
  { key: 'hour', label: 'This hour' },
  { key: 'day', label: 'Today' },
  { key: 'week', label: 'This week' },
  { key: 'month', label: 'This month' },
  { key: 'year', label: 'This year' },
] as const

const formatDaysLeft = (daysLeft: number) => {
  if (daysLeft === 0) {
    return 'Today'
  }

  return daysLeft === 1 ? '1 day' : `${daysLeft} days`
}

const BreakdownSheet: React.FC<BreakdownSheetProps> = ({
  open,
  onClose,
  earnings,
  currency,
  monthlySalaryCurrency,
  exchangeRate,
}) => {
  const { nextPayday, rates } = earnings
  const showExchangeRate = currency !== monthlySalaryCurrency

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Breakdown"
      description="Next payday, earnings so far and your rate"
    >
      <section className="mb-6 flex items-center gap-4 rounded-card bg-card p-4">
        <img
          src={`${import.meta.env.BASE_URL}images/money-face.png`}
          alt=""
          className="size-14 shrink-0 object-contain"
          draggable={false}
        />
        <div className="min-w-0 flex-1">
          <p className="text-footnote text-muted-foreground">Next payday</p>
          <p className="text-body leading-snug font-semibold">
            {dayjs(nextPayday.date).format('dddd, MMMM D')}
          </p>
          <p className="text-subheadline [overflow-wrap:anywhere] text-muted-foreground">
            {formatCurrency(nextPayday.amount, currency)} paycheck
          </p>
        </div>
        <p className="shrink-0 text-body font-semibold text-primary">
          {formatDaysLeft(nextPayday.daysLeft)}
        </p>
      </section>

      <ListGroup title="Earned so far">
        {EARNED_ROWS.map(({ key, label }) => {
          const { earned, total } = earnings[key]
          const progress =
            total > 0 ? Math.min(100, Math.max(0, (earned / total) * 100)) : 0

          return (
            <div
              key={key}
              className="relative px-4 py-3 after:absolute after:right-0 after:bottom-0 after:left-4 after:h-[0.5px] after:bg-border last:after:hidden"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="shrink-0 text-body">{label}</span>
                <span className="flex min-w-0 flex-wrap items-baseline justify-end gap-x-1.5 text-right">
                  <span className="text-body font-semibold whitespace-nowrap text-primary">
                    {formatCurrency(earned, currency)}
                  </span>
                  <span className="text-footnote whitespace-nowrap text-muted-foreground">
                    of {formatCurrency(total, currency)}
                  </span>
                </span>
              </div>
              <Progress
                value={progress}
                aria-label={`${label} progress`}
                className="mt-2 h-1 bg-secondary"
              />
            </div>
          )
        })}
      </ListGroup>

      <ListGroup
        title="Your rate"
        footer={`Pay is spread evenly over each working day (Mon–Fri) between your start and end time.${
          showExchangeRate
            ? ` Exchange rate: 1 ${monthlySalaryCurrency} = ${exchangeRate} ${currency}.`
            : ''
        }`}
      >
        <ListRow label="Per second">
          <span className="text-body font-semibold">
            {formatCurrency(rates.perSecond, currency, 4)}
          </span>
        </ListRow>
        <ListRow label="Per minute">
          <span className="text-body font-semibold">
            {formatCurrency(rates.perMinute, currency)}
          </span>
        </ListRow>
        <ListRow label="Per hour">
          <span className="text-body font-semibold">
            {formatCurrency(rates.perHour, currency)}
          </span>
        </ListRow>
        <ListRow label="Per day">
          <span className="text-body font-semibold">
            {formatCurrency(rates.perDay, currency)}
          </span>
        </ListRow>
      </ListGroup>
    </Sheet>
  )
}

export default React.memo(BreakdownSheet)
