import React, { useCallback, useMemo, useState } from 'react'
import { trackAmplitudeEvent } from '../amplitude'
import { WORKING_DAYS, WORKING_HOURS_PER_DAY } from '../constants'
import {
  calculateWorkingHoursPerDayValue,
  formatEventTime,
  formatTimeInputValue,
  getEndHourFromStart,
  getNextEndAndStartHours,
  getNextStartAndEndHours,
  normalizeWorkingDays,
  normalizeWorkingHoursPerDay,
  parseSalaryInputValue,
  parseTimeInputValue,
} from '../utils/salaryForm'
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
  const [isInputsCollapsed, setIsInputsCollapsed] = useLocalStorage(
    'isInputsCollapsed',
    false
  )
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const {
    currentEarnings,
    monthEarnings,
    dayEarnings,
    totalDayEarnings,
    exchangeRate,
  } = useEarnings(
    monthlySalary,
    monthlySalaryCurrency,
    earningsCurrency,
    startHour,
    endHour,
    workingDays,
    workingHoursPerDay
  )

  const handleSetMonthlySalary = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMonthlySalary(parseSalaryInputValue(event.target.value))
  }

  const handleMonthlySalaryBlur = useCallback(() => {
    trackAmplitudeEvent('salary_input_blurred', {
      salary_value: monthlySalary,
      has_salary_value: monthlySalary > 0,
    })
  }, [monthlySalary])

  const handleSetMonthlySalaryCurrency = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const nextCurrency = event.target.value
    setMonthlySalaryCurrency(nextCurrency)
    trackAmplitudeEvent('salary_currency_changed', {
      currency: nextCurrency,
    })
  }

  const handleSetEarningsCurrency = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const nextCurrency = event.target.value
    setEarningsCurrency(nextCurrency)
    trackAmplitudeEvent('earnings_currency_changed', {
      currency: nextCurrency,
    })
  }

  const handleSetWorkingHoursPerDay = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextWorkingHoursPerDay = normalizeWorkingHoursPerDay(
      parseSalaryInputValue(event.target.value)
    )

    setWorkingHoursPerDay(nextWorkingHoursPerDay)
    if (startHour) {
      setEndHour(getEndHourFromStart(startHour, nextWorkingHoursPerDay))
    }
  }

  const handleSetWorkingDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWorkingDays(normalizeWorkingDays(parseSalaryInputValue(event.target.value)))
  }

  const handleStartHourChange = (date: Date | null) => {
    const nextHours = getNextStartAndEndHours(date, endHour, workingHoursPerDay)

    setStartHour(nextHours.startHour)
    setEndHour(nextHours.endHour)
    trackAmplitudeEvent('workday_start_time_changed', {
      start_time: formatEventTime(date),
    })
  }

  const handleEndHourChange = (date: Date | null) => {
    const nextHours = getNextEndAndStartHours(date, startHour)

    setStartHour(nextHours.startHour)
    setEndHour(nextHours.endHour)
    setWorkingHoursPerDay(
      calculateWorkingHoursPerDayValue(nextHours.startHour, nextHours.endHour)
    )
    trackAmplitudeEvent('workday_end_time_changed', {
      end_time: formatEventTime(date),
    })
  }

  const handleSettingsClick = useCallback(() => {
    setIsSidebarOpen(true)
    trackAmplitudeEvent('settings_clicked')
  }, [])

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  const handleToggleInputsCollapsed = useCallback(() => {
    setIsInputsCollapsed((previousValue) => {
      const nextValue = !previousValue

      trackAmplitudeEvent('inputs_collapsed_toggled', {
        is_inputs_collapsed: nextValue,
      })

      return nextValue
    })
  }, [setIsInputsCollapsed])

  return {
    monthlySalary,
    monthlySalaryCurrency,
    earningsCurrency,
    workingHoursPerDay,
    workingDays,
    isInputsCollapsed,
    startHour,
    endHour,
    isSidebarOpen,
    currentEarnings,
    monthEarnings,
    dayEarnings,
    totalDayEarnings,
    exchangeRate,
    handleSetMonthlySalary,
    handleMonthlySalaryBlur,
    handleSetMonthlySalaryCurrency,
    handleSetEarningsCurrency,
    handleSetWorkingHoursPerDay,
    handleSetWorkingDays,
    handleStartHourChange,
    handleEndHourChange,
    handleSettingsClick,
    handleCloseSidebar,
    handleToggleInputsCollapsed,
  }
}
