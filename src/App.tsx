import React, { useState } from 'react'
import { useLocalStorage, useEarnings } from './hooks'
import { formatCurrency } from './utils/calculations'
import Header from './components/Header'
import CurrencySelect from './components/CurrencySelect/CurrencySelect'
import TimePicker from './components/TimePicker'

const App: React.FC = () => {
  const [monthlySalary, setMonthlySalary] = useLocalStorage('monthlySalary', 0)
  const [monthlySalaryCurrency, setMonthlySalaryCurrency] = useLocalStorage(
    'monthlySalaryCurrency',
    'USD'
  )
  const [earningsCurrency, setEarningsCurrency] = useLocalStorage(
    'earningsCurrency',
    'UAH'
  )
  const [startHour, setStartHour] = useState<Date | null>(new Date())
  const [endHour, setEndHour] = useState<Date | null>(new Date())

  const { currentEarnings, monthEarnings, dayEarnings, exchangeRate } =
    useEarnings(
      monthlySalary,
      monthlySalaryCurrency,
      earningsCurrency,
      startHour,
      endHour
    )

  const handleSetMonthlySalary = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMonthlySalary(Number(event.target.value))
  }

  const handleSetMonthlySalaryCurrency = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setMonthlySalaryCurrency(event.target.value)
  }

  const handleSetEarningsCurrency = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEarningsCurrency(event.target.value)
  }

  const handleStartHourChange = (date: Date | null) => {
    if (date && endHour && date.getTime() > endHour.getTime()) {
      setEndHour(date)
    }
    setStartHour(date)
  }

  const handleEndHourChange = (date: Date | null) => {
    if (date && startHour && date.getTime() < startHour.getTime()) {
      setStartHour(date)
    }
    setEndHour(date)
  }

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-md p-4">
        <label className="mb-2 block text-gray-300">Monthly Salary:</label>
        <div className="mb-4 flex items-center gap-4">
          <div className="flex-1">
            <input
              type="number"
              value={monthlySalary}
              onChange={handleSetMonthlySalary}
              className="w-full rounded border border-gray-200/20 bg-gray-400/10 p-2 outline-gray-200/20"
            />
          </div>
          <div>
            <CurrencySelect
              selectedCurrency={monthlySalaryCurrency}
              onCurrencyChange={handleSetMonthlySalaryCurrency}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <TimePicker
            label="Start Working Hour"
            selected={startHour}
            onChange={handleStartHourChange}
          />
          <TimePicker
            label="End Working Hour"
            selected={endHour}
            onChange={handleEndHourChange}
          />
        </div>

        <CurrencySelect
          className="mb-4"
          label="Earnings Currency"
          selectedCurrency={earningsCurrency}
          onCurrencyChange={handleSetEarningsCurrency}
        />

        <div className="h-full w-full overflow-hidden rounded-md border border-gray-200/20 bg-gray-400/10 p-4 shadow-lg">
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
                Month salary: {formatCurrency(monthEarnings, earningsCurrency)}
              </div>
              <div className="text-xs text-gray-500">
                Exchange Rate: {exchangeRate} {earningsCurrency}/
                {monthlySalaryCurrency}
              </div>
            </div>
            {currentEarnings > 0 && (
              <img width={90} src="/images/money-flying.gif" alt="" />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
//TODO: add onboarding tooltips
