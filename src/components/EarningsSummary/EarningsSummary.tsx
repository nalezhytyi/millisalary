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
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="mb-2 text-2xl font-bold text-gray-200">
            <div className="text-xl text-gray-300">Current earnings:</div>
            {formatCurrency(currentEarnings, earningsCurrency)}
          </div>
          <div className="mb-10 text-lg text-gray-200">
            Today: {formatCurrency(dayEarnings, earningsCurrency)}
          </div>
          <div className="text-lg text-gray-300">
            Daily: {formatCurrency(totalDayEarnings, earningsCurrency)}
          </div>
          <div className="text-lg text-gray-300">
            Monthly: {formatCurrency(monthEarnings, earningsCurrency)}
          </div>
          <div className="text-xs text-gray-500">
            Exchange Rate: {exchangeRate} {earningsCurrency}/
            {monthlySalaryCurrency}
          </div>
        </div>
        {currentEarnings > 0 && <img width={90} src="images/money-flying.gif" alt="" />}
      </div>
    </div>
  )
}

export default React.memo(EarningsSummary)
