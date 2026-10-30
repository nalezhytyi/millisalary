import { useCallback, useMemo, useRef, useState } from 'react'
import { trackAmplitudeEvent } from '../amplitude'
import { WORKING_DAYS, WORKING_HOURS_PER_DAY } from '../constants'
import {
  formatEventTime,
  formatTimeInputValue,
  getEndHourFromStart,
  parseTimeInputValue,
} from '../utils/salaryForm'
import { getChangedFields, type SettingsValues } from '../utils/settingsDraft'
import { isPeriod, type Period } from '../utils/calculations'
import { useEarnings } from './useEarnings'
import { useLocalStorage } from './useLocalStorage'

const DEFAULT_START_HOUR = '09:00'
const DEFAULT_END_HOUR = formatTimeInputValue(
  getEndHourFromStart(
    parseTimeInputValue(DEFAULT_START_HOUR, null)!,
    WORKING_HOURS_PER_DAY
  )
)

export const useAppState = () => {
  const [monthlySalary, setMonthlySalary] = useLocalStorage('monthlySalary', 0)
  const [monthlySalaryCurrency, setMonthlySalaryCurrency] = useLocalStorage(
    'monthlySalaryCurrency',
    'USD'
  )
  const [earningsCurrency, setEarningsCurrency] = useLocalStorage(
    'earningsCurrency',
    'UAH'
  )
  const [workingHoursPerDay, setWorkingHoursPerDay] = useLocalStorage(
    'workingHoursPerDay',
    WORKING_HOURS_PER_DAY
  )
  const [workingDays, setWorkingDays] = useLocalStorage(
    'workingDays',
    WORKING_DAYS
  )
  const [payday, setPayday] = useLocalStorage('payday', 1)
  const [storedPeriod, setSelectedPeriod] = useLocalStorage<Period>(
    'selectedPeriod',
    'day'
  )
  // localStorage is untrusted: an unknown period would crash the dial
  const selectedPeriod = isPeriod(storedPeriod) ? storedPeriod : 'day'
  const [startHourValue, setStartHourValue] = useLocalStorage(
    'startHour',
    DEFAULT_START_HOUR
  )
  const [endHourValue, setEndHourValue] = useLocalStorage(
    'endHour',
    DEFAULT_END_HOUR
  )
  const startHour = useMemo(
    () => parseTimeInputValue(startHourValue, null),
    [startHourValue]
  )
  const endHour = useMemo(
    () => parseTimeInputValue(endHourValue, null),
    [endHourValue]
  )
  const setStartHour = useCallback(
    (date: Date | null) => setStartHourValue(formatTimeInputValue(date)),
    [setStartHourValue]
  )
  const setEndHour = useCallback(
    (date: Date | null) => setEndHourValue(formatTimeInputValue(date)),
    [setEndHourValue]
  )
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false)
  const sheetOpenedAt = useRef({ settings: 0, breakdown: 0 })

  const { earnings, exchangeRate } = useEarnings(
    monthlySalary,
    monthlySalaryCurrency,
    earningsCurrency,
    startHour,
    endHour,
    workingDays,
    workingHoursPerDay,
    payday
  )

  // Handlers are stable (useCallback) so the memoized screens skip the 100 ms
  // earnings re-render
  const openSettings = useCallback((source: 'header' | 'setup_hint') => {
    sheetOpenedAt.current.settings = Date.now()
    setIsSettingsOpen(true)
    trackAmplitudeEvent('settings_clicked', { source })
  }, [])

  const handleSettingsClick = useCallback(
    () => openSettings('header'),
    [openSettings]
  )

  const handleSetupHintSettingsClick = useCallback(
    () => openSettings('setup_hint'),
    [openSettings]
  )

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false)
    trackAmplitudeEvent('settings_closed', {
      duration_ms: Date.now() - sheetOpenedAt.current.settings,
    })
  }, [])

  // Settings edit a draft; this is the only place they reach storage. The
  // per-field events fire here, once, for the fields that actually changed
  const handleSaveSettings = useCallback(
    (next: SettingsValues) => {
      const saved: SettingsValues = {
        monthlySalary,
        monthlySalaryCurrency,
        earningsCurrency,
        workingHoursPerDay,
        workingDays,
        payday,
        startHour,
        endHour,
      }
      const changedFields = getChangedFields(saved, next)

      setMonthlySalary(next.monthlySalary)
      setMonthlySalaryCurrency(next.monthlySalaryCurrency)
      setEarningsCurrency(next.earningsCurrency)
      setWorkingHoursPerDay(next.workingHoursPerDay)
      setWorkingDays(next.workingDays)
      setPayday(next.payday)
      setStartHour(next.startHour)
      setEndHour(next.endHour)

      const events: Record<string, () => void> = {
        monthly_salary: () =>
          trackAmplitudeEvent('salary_input_blurred', {
            salary_value: next.monthlySalary,
            has_salary_value: next.monthlySalary > 0,
          }),
        monthly_salary_currency: () =>
          trackAmplitudeEvent('salary_currency_changed', {
            currency: next.monthlySalaryCurrency,
          }),
        earnings_currency: () =>
          trackAmplitudeEvent('earnings_currency_changed', {
            currency: next.earningsCurrency,
          }),
        working_days: () =>
          trackAmplitudeEvent('working_days_changed', {
            working_days: next.workingDays,
          }),
        working_hours_per_day: () =>
          trackAmplitudeEvent('working_hours_per_day_changed', {
            working_hours_per_day: next.workingHoursPerDay,
          }),
        start_time: () =>
          trackAmplitudeEvent('workday_start_time_changed', {
            start_time: formatEventTime(next.startHour),
          }),
        end_time: () =>
          trackAmplitudeEvent('workday_end_time_changed', {
            end_time: formatEventTime(next.endHour),
          }),
        payday: () =>
          trackAmplitudeEvent('payday_changed', { payday: next.payday }),
      }

      changedFields.forEach((field) => events[field]?.())
      trackAmplitudeEvent('settings_saved', { changed_fields: changedFields })
      handleCloseSettings()
    },
    [
      monthlySalary,
      monthlySalaryCurrency,
      earningsCurrency,
      workingHoursPerDay,
      workingDays,
      payday,
      startHour,
      endHour,
      setMonthlySalary,
      setMonthlySalaryCurrency,
      setEarningsCurrency,
      setWorkingHoursPerDay,
      setWorkingDays,
      setPayday,
      setStartHour,
      setEndHour,
      handleCloseSettings,
    ]
  )

  const handleDiscardSettings = useCallback(() => {
    trackAmplitudeEvent('settings_discarded')
    handleCloseSettings()
  }, [handleCloseSettings])

  const handleBreakdownClick = useCallback(() => {
    sheetOpenedAt.current.breakdown = Date.now()
    setIsBreakdownOpen(true)
    trackAmplitudeEvent('breakdown_opened')
  }, [])

  const handleCloseBreakdown = useCallback(() => {
    setIsBreakdownOpen(false)
    trackAmplitudeEvent('breakdown_closed', {
      duration_ms: Date.now() - sheetOpenedAt.current.breakdown,
    })
  }, [])

  const handlePeriodChange = useCallback(
    (period: Period) => {
      setSelectedPeriod(period)
      trackAmplitudeEvent('period_changed', { period })
    },
    [setSelectedPeriod]
  )

  return {
    monthlySalary,
    monthlySalaryCurrency,
    earningsCurrency,
    workingHoursPerDay,
    workingDays,
    payday,
    selectedPeriod,
    startHour,
    endHour,
    isSettingsOpen,
    isBreakdownOpen,
    earnings,
    exchangeRate,
    handleSettingsClick,
    handleSetupHintSettingsClick,
    handleCloseSettings,
    handleSaveSettings,
    handleDiscardSettings,
    handleBreakdownClick,
    handleCloseBreakdown,
    handlePeriodChange,
  }
}
