import React from 'react'
import CurrencySelect from '@/components/CurrencySelect'
import ListGroup from '@/components/ListGroup'
import ListRow from '@/components/ListRow'
import NumberInput from '@/components/NumberInput'
import NavScreen from '@/components/NavScreen'
import SegmentedControl from '@/components/SegmentedControl'
import TimePicker from '@/components/TimePicker'
import type { Theme } from '@/hooks'

interface SettingsScreenProps {
  open: boolean
  onClose: () => void
  monthlySalary: number
  monthlySalaryCurrency: string
  earningsCurrency: string
  workingHoursPerDay: number
  workingDays: number
  payday: number
  startHour: Date | null
  endHour: Date | null
  theme: Theme
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
  onWorkingHoursPerDayBlur: () => void
  onWorkingDaysChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onWorkingDaysBlur: () => void
  onPaydayChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onPaydayBlur: () => void
  onStartHourChange: (date: Date | null) => void
  onEndHourChange: (date: Date | null) => void
  onThemeChange: (theme: Theme) => void
}

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const numberInputClasses =
  'h-[52px] w-32 border-0 bg-transparent p-0 text-right text-body shadow-none focus-visible:ring-0 dark:bg-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] md:text-body'

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  open,
  onClose,
  monthlySalary,
  monthlySalaryCurrency,
  earningsCurrency,
  workingHoursPerDay,
  workingDays,
  payday,
  startHour,
  endHour,
  theme,
  onMonthlySalaryChange,
  onMonthlySalaryBlur,
  onMonthlySalaryCurrencyChange,
  onEarningsCurrencyChange,
  onWorkingHoursPerDayChange,
  onWorkingHoursPerDayBlur,
  onWorkingDaysChange,
  onWorkingDaysBlur,
  onPaydayChange,
  onPaydayBlur,
  onStartHourChange,
  onEndHourChange,
  onThemeChange,
}) => {
  return (
    <NavScreen open={open} onClose={onClose} title="Settings">
      <ListGroup
        title="Salary"
        footer="Your monthly salary is spread over your working days and hours. Earnings are shown in the display currency."
      >
        <ListRow label="Monthly salary" htmlFor="monthly-salary">
          <NumberInput
            id="monthly-salary"
            inputMode="numeric"
            value={monthlySalary}
            onChange={onMonthlySalaryChange}
            onBlur={onMonthlySalaryBlur}
            className={numberInputClasses}
          />
        </ListRow>
        <ListRow label="Salary currency">
          <CurrencySelect
            aria-label="Salary currency"
            selectedCurrency={monthlySalaryCurrency}
            onCurrencyChange={onMonthlySalaryCurrencyChange}
          />
        </ListRow>
        <ListRow label="Display currency">
          <CurrencySelect
            aria-label="Display currency"
            selectedCurrency={earningsCurrency}
            onCurrencyChange={onEarningsCurrencyChange}
          />
        </ListRow>
      </ListGroup>

      <ListGroup
        title="Schedule"
        footer="Hours per day follow the Start and End times: changing one updates the other."
      >
        <ListRow label="Working days / month" htmlFor="working-days">
          <NumberInput
            id="working-days"
            inputMode="numeric"
            min="1"
            max="31"
            step="1"
            value={workingDays}
            onChange={onWorkingDaysChange}
            onBlur={onWorkingDaysBlur}
            className={numberInputClasses}
          />
        </ListRow>
        <ListRow label="Working hours / day" htmlFor="working-hours">
          <NumberInput
            id="working-hours"
            // halves are allowed; iOS's numeric keypad has no decimal key
            inputMode="decimal"
            min="0.5"
            max="24"
            step="0.5"
            value={workingHoursPerDay}
            onChange={onWorkingHoursPerDayChange}
            onBlur={onWorkingHoursPerDayBlur}
            className={numberInputClasses}
          />
        </ListRow>
        <ListRow label="Start time">
          <TimePicker
            label="Start time"
            selected={startHour}
            onChange={onStartHourChange}
          />
        </ListRow>
        <ListRow label="End time">
          <TimePicker
            label="End time"
            selected={endHour}
            onChange={onEndHourChange}
          />
        </ListRow>
      </ListGroup>

      <ListGroup
        title="Payday"
        footer="Day of the month your salary arrives. In shorter months the last day is used."
      >
        <ListRow label="Day of month" htmlFor="payday">
          <NumberInput
            id="payday"
            inputMode="numeric"
            min="1"
            max="31"
            step="1"
            value={payday}
            onChange={onPaydayChange}
            onBlur={onPaydayBlur}
            className={numberInputClasses}
          />
        </ListRow>
      </ListGroup>

      <ListGroup
        title="Appearance"
        footer="System follows your device's light or dark setting."
      >
        <div className="p-2.5">
          <SegmentedControl
            aria-label="Appearance"
            options={THEME_OPTIONS}
            value={theme}
            onChange={onThemeChange}
          />
        </div>
      </ListGroup>
    </NavScreen>
  )
}

export default React.memo(SettingsScreen)
