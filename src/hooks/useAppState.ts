import React, { useCallback, useMemo, useRef, useState } from 'react'
import { trackAmplitudeEvent } from '../amplitude'
import { WORKING_DAYS, WORKING_HOURS_PER_DAY } from '../constants'
import {
  calculateWorkingHoursPerDayValue,
  formatEventTime,
  formatTimeInputValue,
  getEndHourFromStart,
  getNextEndAndStartHours,
  getNextStartAndEndHours,
  normalizePayday,
  normalizeWorkingDays,
  normalizeWorkingHoursPerDay,
  parseSalaryInputValue,
  parseTimeInputValue,
} from '../utils/salaryForm'
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
  // Number fields report one *_changed event on blur, not one per keystroke
  const editedFields = useRef(new Set<string>())
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

  // Handlers are stable (useCallback) so the memoized sheets skip the 100 ms
  // earnings re-render
  const handleSetMonthlySalary = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMonthlySalary(parseSalaryInputValue(event.target.value))
    },
    [setMonthlySalary]
  )

  const handleMonthlySalaryBlur = useCallback(() => {
    trackAmplitudeEvent('salary_input_blurred', {
      salary_value: monthlySalary,
      has_salary_value: monthlySalary > 0,
    })
  }, [monthlySalary])

  const handleSetMonthlySalaryCurrency = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const nextCurrency = event.target.value
      setMonthlySalaryCurrency(nextCurrency)
      trackAmplitudeEvent('salary_currency_changed', {
        currency: nextCurrency,
      })
    },
    [setMonthlySalaryCurrency]
  )

  const handleSetEarningsCurrency = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const nextCurrency = event.target.value
      setEarningsCurrency(nextCurrency)
      trackAmplitudeEvent('earnings_currency_changed', {
        currency: nextCurrency,
      })
    },
    [setEarningsCurrency]
  )

  const handleSetWorkingHoursPerDay = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextWorkingHoursPerDay = normalizeWorkingHoursPerDay(
        parseSalaryInputValue(event.target.value)
      )

      setWorkingHoursPerDay(nextWorkingHoursPerDay)
      editedFields.current.add('working_hours_per_day')
      if (startHour) {
        setEndHour(getEndHourFromStart(startHour, nextWorkingHoursPerDay))
      }
    },
    [setWorkingHoursPerDay, setEndHour, startHour]
  )

  const handleSetWorkingDays = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setWorkingDays(
        normalizeWorkingDays(parseSalaryInputValue(event.target.value))
      )
      editedFields.current.add('working_days')
    },
    [setWorkingDays]
  )

  const handleWorkingDaysBlur = useCallback(() => {
    if (editedFields.current.delete('working_days')) {
      trackAmplitudeEvent('working_days_changed', { working_days: workingDays })
    }
  }, [workingDays])

  const handleWorkingHoursPerDayBlur = useCallback(() => {
    if (editedFields.current.delete('working_hours_per_day')) {
      trackAmplitudeEvent('working_hours_per_day_changed', {
        working_hours_per_day: workingHoursPerDay,
      })
    }
  }, [workingHoursPerDay])

  const handleSetPayday = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPayday(normalizePayday(parseSalaryInputValue(event.target.value)))
      editedFields.current.add('payday')
    },
    [setPayday]
  )

  const handlePaydayBlur = useCallback(() => {
    if (editedFields.current.delete('payday')) {
      trackAmplitudeEvent('payday_changed', { payday })
    }
  }, [payday])

  const handleStartHourChange = useCallback(
    (date: Date | null) => {
      const nextHours = getNextStartAndEndHours(
        date,
        endHour,
        workingHoursPerDay
      )

      setStartHour(nextHours.startHour)
      setEndHour(nextHours.endHour)
      trackAmplitudeEvent('workday_start_time_changed', {
        start_time: formatEventTime(date),
      })
    },
    [endHour, workingHoursPerDay, setStartHour, setEndHour]
  )

  const handleEndHourChange = useCallback(
    (date: Date | null) => {
      const nextHours = getNextEndAndStartHours(date, startHour)

      setStartHour(nextHours.startHour)
      setEndHour(nextHours.endHour)
      setWorkingHoursPerDay(
        calculateWorkingHoursPerDayValue(nextHours.startHour, nextHours.endHour)
      )
      trackAmplitudeEvent('workday_end_time_changed', {
        end_time: formatEventTime(date),
      })
    },
    [startHour, setStartHour, setEndHour, setWorkingHoursPerDay]
  )

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
    // A field still focused when the sheet closes may never get its blur
    // (iOS keeps focus on the input while Done is tapped), so flush it here
    handleWorkingDaysBlur()
    handleWorkingHoursPerDayBlur()
    handlePaydayBlur()
    setIsSettingsOpen(false)
    trackAmplitudeEvent('settings_closed', {
      duration_ms: Date.now() - sheetOpenedAt.current.settings,
    })
  }, [handleWorkingDaysBlur, handleWorkingHoursPerDayBlur, handlePaydayBlur])

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
    handleSetMonthlySalary,
    handleMonthlySalaryBlur,
    handleSetMonthlySalaryCurrency,
    handleSetEarningsCurrency,
    handleSetWorkingHoursPerDay,
    handleWorkingHoursPerDayBlur,
    handleSetWorkingDays,
    handleWorkingDaysBlur,
    handleSetPayday,
    handlePaydayBlur,
    handleStartHourChange,
    handleEndHourChange,
    handleSettingsClick,
    handleSetupHintSettingsClick,
    handleCloseSettings,
    handleBreakdownClick,
    handleCloseBreakdown,
    handlePeriodChange,
  }
}
