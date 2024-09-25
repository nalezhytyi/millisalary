import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { useLocalStorage, useEarnings } from './hooks'
import { formatCurrency } from './utils/calculations'
import Header from './components/Header'
import CurrencySelect from './components/CurrencySelect/CurrencySelect'

const TimePicker: React.FC<{
  label: string
  selected: Date | null
  onChange: (date: Date | null) => void
}> = ({ label, selected, onChange }) => (
  <div className="mb-4 flex-1">
    <label className="mb-2 block text-gray-300">{label}</label>
    <DatePicker
      selected={selected}
      onChange={onChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={30}
      timeCaption={label}
      dateFormat="HH:mm"
      timeFormat="HH:mm"
      className="w-full rounded p-2 outline outline-gray-200/20"
    />
  </div>
)

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
              className="w-full rounded p-2 outline outline-gray-200/20"
            />
          </div>
          <div>
            <CurrencySelect
              selectedCurrency={monthlySalaryCurrency}
              onCurrencyChange={handleSetMonthlySalaryCurrency}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
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

        <div className="h-full w-full rounded-md border border-gray-200/20 bg-gray-950 bg-opacity-50 p-4 pb-8 shadow-lg">
          <div className="mb-2 flex items-end justify-between gap-2">
            <div className="text-xl font-bold text-gray-200">
              Current earnings:{' '}
              {formatCurrency(currentEarnings, earningsCurrency)}
            </div>
            <img width={40} src="/images/party-popper.gif" alt="" />
          </div>

          <div className="mb-8 text-lg text-gray-200">
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
      </div>
    </>
  )
}

export default App
