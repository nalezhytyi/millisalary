import React, { useMemo, useState } from 'react'
import CurrencySelect from '@/components/CurrencySelect'
import DiscardAlert from '@/components/DiscardAlert'
import ListGroup from '@/components/ListGroup'
import ListRow from '@/components/ListRow'
import NavScreen from '@/components/NavScreen'
import NumberInput from '@/components/NumberInput'
import { CheckmarkSymbol } from '@/components/SFSymbol'
import SegmentedControl from '@/components/SegmentedControl'
import TimePicker from '@/components/TimePicker'
import { Button } from '@/components/ui/button'
import type { Theme } from '@/hooks'
import {
  getChangedFields,
  withEndHour,
  withMonthlySalary,
  withPayday,
  withStartHour,
  withWorkingDays,
  withWorkingHoursPerDay,
  type SettingsValues,
} from '@/utils/settingsDraft'

interface SettingsScreenProps {
  open: boolean
  onClose: () => void
  onSave: (values: SettingsValues) => void
  onDiscard: () => void
  monthlySalary: number
  monthlySalaryCurrency: string
  earningsCurrency: string
  workingHoursPerDay: number
  workingDays: number
  payday: number
  startHour: Date | null
  endHour: Date | null
  theme: Theme
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
  onSave,
  onDiscard,
  monthlySalary,
  monthlySalaryCurrency,
  earningsCurrency,
  workingHoursPerDay,
  workingDays,
  payday,
  startHour,
  endHour,
  theme,
  onThemeChange,
}) => {
  const saved = useMemo<SettingsValues>(
    () => ({
      monthlySalary,
      monthlySalaryCurrency,
      earningsCurrency,
      workingHoursPerDay,
      workingDays,
      payday,
      startHour,
      endHour,
    }),
    [
      monthlySalary,
      monthlySalaryCurrency,
      earningsCurrency,
      workingHoursPerDay,
      workingDays,
      payday,
      startHour,
      endHour,
    ]
  )
  // Edits go to a draft that starts from the saved values every time the
  // screen opens; only the checkmark writes them back. Appearance is not part
  // of it: it applies at once.
  const [draft, setDraft] = useState(saved)
  const [wasOpen, setWasOpen] = useState(open)
  const [isDiscardAlertOpen, setIsDiscardAlertOpen] = useState(false)

  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setDraft(saved)
    }
  }

  const hasChanges = getChangedFields(saved, draft).length > 0

  // Back, Esc and (later) the swipe all come here: with unsaved changes they
  // ask first. An open alert owns Esc, so ignore the screen's own Esc then.
  const requestClose = () => {
    if (isDiscardAlertOpen) {
      return
    }
    if (hasChanges) {
      setIsDiscardAlertOpen(true)
    } else {
      onClose()
    }
  }

  return (
    <>
      <NavScreen
        open={open}
        onClose={requestClose}
        title="Settings"
        action={
          <Button
            size="icon"
            aria-label="Save"
            disabled={!hasChanges}
            onClick={() => onSave(draft)}
          >
            <CheckmarkSymbol />
          </Button>
        }
      >
        <ListGroup
          title="Salary"
          footer="Your monthly salary is spread over your working days and hours. Earnings are shown in the display currency."
        >
          <ListRow label="Monthly salary" htmlFor="monthly-salary">
            <NumberInput
              id="monthly-salary"
              inputMode="numeric"
              value={draft.monthlySalary}
              onChange={(event) =>
                setDraft((current) =>
                  withMonthlySalary(current, event.target.value)
                )
              }
              className={numberInputClasses}
            />
          </ListRow>
          <ListRow label="Salary currency">
            <CurrencySelect
              aria-label="Salary currency"
              selectedCurrency={draft.monthlySalaryCurrency}
              onCurrencyChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  monthlySalaryCurrency: event.target.value,
                }))
              }
            />
          </ListRow>
          <ListRow label="Display currency">
            <CurrencySelect
              aria-label="Display currency"
              selectedCurrency={draft.earningsCurrency}
              onCurrencyChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  earningsCurrency: event.target.value,
                }))
              }
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
              value={draft.workingDays}
              onChange={(event) =>
                setDraft((current) =>
                  withWorkingDays(current, event.target.value)
                )
              }
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
              value={draft.workingHoursPerDay}
              onChange={(event) =>
                setDraft((current) =>
                  withWorkingHoursPerDay(current, event.target.value)
                )
              }
              className={numberInputClasses}
            />
          </ListRow>
          <ListRow label="Start time">
            <TimePicker
              label="Start time"
              selected={draft.startHour}
              onChange={(date) =>
                setDraft((current) => withStartHour(current, date))
              }
            />
          </ListRow>
          <ListRow label="End time">
            <TimePicker
              label="End time"
              selected={draft.endHour}
              onChange={(date) =>
                setDraft((current) => withEndHour(current, date))
              }
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
              value={draft.payday}
              onChange={(event) =>
                setDraft((current) => withPayday(current, event.target.value))
              }
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
      <DiscardAlert
        open={isDiscardAlertOpen}
        onKeepEditing={() => setIsDiscardAlertOpen(false)}
        onDiscard={() => {
          setIsDiscardAlertOpen(false)
          onDiscard()
        }}
      />
    </>
  )
}

export default React.memo(SettingsScreen)
