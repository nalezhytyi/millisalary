import React from 'react'
import CurrencySelect from '../CurrencySelect'
import InfoLabel from '../InfoLabel'
import TimePicker from '../TimePicker'

interface SalaryInputsProps {
  monthlySalary: number
  monthlySalaryCurrency: string
  earningsCurrency: string
  workingHoursPerDay: number
  workingDays: number
  startHour: Date | null
  endHour: Date | null
  onMonthlySalaryChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onMonthlySalaryBlur: () => void
  onMonthlySalaryCurrencyChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void
  onEarningsCurrencyChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void
  onWorkingHoursPerDayChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  onWorkingDaysChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onStartHourChange: (date: Date | null) => void
  onEndHourChange: (date: Date | null) => void
}

const fieldClasses =
  'w-full rounded border border-gray-200/20 bg-gray-400/10 p-2 text-gray-200 outline-gray-200/20 backdrop-blur-md'

const SalaryInputs: React.FC<SalaryInputsProps> = ({
  monthlySalary,
  monthlySalaryCurrency,
  earningsCurrency,
  workingHoursPerDay,
  workingDays,
  startHour,
  endHour,
  onMonthlySalaryChange,
  onMonthlySalaryBlur,
  onMonthlySalaryCurrencyChange,
  onEarningsCurrencyChange,
  onWorkingHoursPerDayChange,
  onWorkingDaysChange,
  onStartHourChange,
      onEndHourChange,
}) => {
  return (
    <section aria-label="Salary inputs">
      <InfoLabel
        className="mb-2"
        label="Monthly Salary"
        info="Your total salary for the month before any live earnings breakdown."
      />
      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1">
          <input
            type="number"
            value={monthlySalary}
            onChange={onMonthlySalaryChange}
            onBlur={onMonthlySalaryBlur}
            className={fieldClasses}
          />
        </div>
        <div>
          <CurrencySelect
            selectedCurrency={monthlySalaryCurrency}
            onCurrencyChange={onMonthlySalaryCurrencyChange}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex-1">
          <InfoLabel
            className="mb-2"
            label="Working Days / Month"
            info="How many working days you expect in this month."
            align="start"
          />
          <input
            type="number"
            min="1"
            max="31"
            step="1"
            value={workingDays}
            onChange={onWorkingDaysChange}
            className={fieldClasses}
          />
        </div>
        <div className="flex-1">
          <InfoLabel
            className="mb-2"
            label="Working Hours / Day"
            info="How many hours you usually work in one full workday."
            align="end"
          />
          <input
            type="number"
            min="0.5"
            max="24"
            step="0.5"
            value={workingHoursPerDay}
            onChange={onWorkingHoursPerDayChange}
            className={fieldClasses}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <TimePicker
          label="Start Time"
          infoText="Time when you start working."
          infoAlign="start"
          selected={startHour}
          onChange={onStartHourChange}
        />
        <TimePicker
          label="End Time"
          infoText="Time when you finish working."
          infoAlign="end"
          selected={endHour}
          onChange={onEndHourChange}
        />
      </div>

      <CurrencySelect
        className="mb-4"
        label="Earnings Currency"
        infoText="Currency used to display your calculated earnings."
        infoAlign="start"
        selectedCurrency={earningsCurrency}
        onCurrencyChange={onEarningsCurrencyChange}
      />
    </section>
  )
}

export default React.memo(SalaryInputs)
