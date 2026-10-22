import React from 'react'
import CurrencySelect from '@/components/CurrencySelect'
import ListGroup from '@/components/ListGroup'
import ListRow from '@/components/ListRow'
import SegmentedControl from '@/components/SegmentedControl'
import SheetHeader from '@/components/SheetHeader'
import TimePicker from '@/components/TimePicker'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import type { Theme } from '@/hooks'

interface SettingsSheetProps {
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
  onWorkingDaysChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onPaydayChange: (event: React.ChangeEvent<HTMLInputElement>) => void
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
  'h-11 w-32 border-0 bg-transparent p-0 text-right text-[17px] shadow-none focus-visible:ring-0 dark:bg-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] md:text-[17px]'

const SettingsSheet: React.FC<SettingsSheetProps> = ({
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
  onWorkingDaysChange,
  onPaydayChange,
  onStartHourChange,
  onEndHourChange,
  onThemeChange,
}) => {
  const selectOnFocus = (event: React.FocusEvent<HTMLInputElement>) =>
    event.target.select()

  return (
    <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
      <DrawerContent className="h-[94dvh] bg-background data-[vaul-drawer-direction=bottom]:max-h-[94dvh] data-[vaul-drawer-direction=bottom]:rounded-t-[14px]">
        <SheetHeader title="Settings" />
        <DrawerDescription className="sr-only">
          Salary, working schedule, payday and appearance
        </DrawerDescription>

        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <ListGroup
            title="Salary"
            footer="Your monthly salary is spread over your working days and hours. Earnings are shown in the display currency."
          >
            <ListRow label="Monthly salary" htmlFor="monthly-salary">
              <Input
                id="monthly-salary"
                type="number"
                inputMode="numeric"
                value={monthlySalary}
                onChange={onMonthlySalaryChange}
                onBlur={onMonthlySalaryBlur}
                onFocus={selectOnFocus}
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
              <Input
                id="working-days"
                type="number"
                inputMode="numeric"
                min="1"
                max="31"
                step="1"
                value={workingDays}
                onChange={onWorkingDaysChange}
                onFocus={selectOnFocus}
                className={numberInputClasses}
              />
            </ListRow>
            <ListRow label="Working hours / day" htmlFor="working-hours">
              <Input
                id="working-hours"
                type="number"
                inputMode="numeric"
                min="0.5"
                max="24"
                step="0.5"
                value={workingHoursPerDay}
                onChange={onWorkingHoursPerDayChange}
                onFocus={selectOnFocus}
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
              <Input
                id="payday"
                type="number"
                inputMode="numeric"
                min="1"
                max="31"
                step="1"
                value={payday}
                onChange={onPaydayChange}
                onFocus={selectOnFocus}
                className={numberInputClasses}
              />
            </ListRow>
          </ListGroup>

          <ListGroup
            title="Appearance"
            footer="System follows your device's light or dark setting."
          >
            <div className="p-2">
              <SegmentedControl
                aria-label="Appearance"
                options={THEME_OPTIONS}
                value={theme}
                onChange={onThemeChange}
              />
            </div>
          </ListGroup>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default React.memo(SettingsSheet)
