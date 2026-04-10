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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 text-2xl font-bold text-gray-200">
            <div className="text-xl text-gray-300">Current earnings:</div>
            <div className="break-all leading-tight">
              {formatCurrency(currentEarnings, earningsCurrency)}
            </div>
          </div>
          <div className="mb-10 text-lg text-gray-200">
            <span className="mr-1">Today:</span>
            <span className="break-all">{formatCurrency(dayEarnings, earningsCurrency)}</span>
          </div>
          <div className="text-lg text-gray-300">
            <span className="mr-1">Daily:</span>
            <span className="break-all">{formatCurrency(totalDayEarnings, earningsCurrency)}</span>
          </div>
          <div className="text-lg text-gray-300">
            <span className="mr-1">Monthly:</span>
            <span className="break-all">{formatCurrency(monthEarnings, earningsCurrency)}</span>
          </div>
          <div className="text-xs text-gray-500">
            Exchange Rate: {exchangeRate} {earningsCurrency}/
            {monthlySalaryCurrency}
          </div>
        </div>
        {currentEarnings > 0 && (
          <img
            width={90}
            className="self-end sm:self-auto"
            src="images/money-flying.gif"
            alt=""
          />
        )}
      </div>
    </div>
  )
}

export default React.memo(EarningsSummary)
