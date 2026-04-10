import React from 'react'
import { formatCurrency } from '../../utils/calculations'

interface EarningsSummaryProps {
  currentEarnings: number
  dayEarnings: number
  totalDayEarnings: number
  monthEarnings: number
  earningsCurrency: string
  exchangeRate: number
  monthlySalaryCurrency: string
}

const EarningsSummary: React.FC<EarningsSummaryProps> = ({
  currentEarnings,
  dayEarnings,
  totalDayEarnings,
  monthEarnings,
  earningsCurrency,
  exchangeRate,
  monthlySalaryCurrency,
}) => {
  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-gray-200/20 bg-gray-400/10 p-4 shadow-lg backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 text-xl font-bold text-gray-200 sm:text-2xl">
            <div className="text-lg text-gray-300 sm:text-xl">
              Current earnings:
            </div>
            <div className="leading-tight [overflow-wrap:anywhere]">
              {formatCurrency(currentEarnings, earningsCurrency)}
            </div>
          </div>
          <div className="mb-10 text-lg text-gray-200">
            <span className="mr-1">Today:</span>
            <span className="[overflow-wrap:anywhere]">
              {formatCurrency(dayEarnings, earningsCurrency)}
            </span>
          </div>
          <div className="text-lg text-gray-300">
            <span className="mr-1">Daily:</span>
            <span className="[overflow-wrap:anywhere]">
              {formatCurrency(totalDayEarnings, earningsCurrency)}
            </span>
          </div>
          <div className="text-lg text-gray-300">
            <span className="mr-1">Monthly:</span>
            <span className="[overflow-wrap:anywhere]">
              {formatCurrency(monthEarnings, earningsCurrency)}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Exchange Rate: {exchangeRate} {earningsCurrency}/
            {monthlySalaryCurrency}
          </div>
        </div>
        {currentEarnings > 0 && (
          <img
            width={90}
            className="w-16 flex-shrink-0 sm:w-[90px]"
            src="images/money-flying.gif"
            alt=""
          />
        )}
      </div>
    </div>
  )
}

export default React.memo(EarningsSummary)
