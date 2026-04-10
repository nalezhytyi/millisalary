import dayjs from 'dayjs'
import { WORKING_HOURS_PER_DAY } from '../constants'
import { normalizeWorkingHoursPerDay } from './salaryForm'

export const getWorkingDayMilliseconds = (
  startHour: Date | null,
  endHour: Date | null,
  workingHoursPerDay = WORKING_HOURS_PER_DAY
): number => {
  if (!startHour || !endHour) {
    return normalizeWorkingHoursPerDay(workingHoursPerDay) * 3600 * 1000
  }

  const start = dayjs(startHour)
  const end = dayjs(endHour)
  const diffMilliseconds = end.diff(start)

  if (diffMilliseconds <= 0) {
    return normalizeWorkingHoursPerDay(workingHoursPerDay) * 3600 * 1000
  }

  return diffMilliseconds
}

export const calculateMillisecondsPastToday = (
  now: dayjs.Dayjs,
  startOfDay: dayjs.Dayjs,
  endOfDay: dayjs.Dayjs
): number => {
  if (now.isAfter(startOfDay) && now.isBefore(endOfDay)) {
    return now.diff(startOfDay)
  } else if (now.isAfter(endOfDay)) {
    return endOfDay.diff(startOfDay)
  }
  return 0
}

export const calculateTotalMillisecondsPassed = (
  now: dayjs.Dayjs,
  startOfMonth: dayjs.Dayjs,
  workingDayMilliseconds = WORKING_HOURS_PER_DAY * 3600 * 1000
): number => {
  let totalMillisecondsPassed = 0
  for (let date = startOfMonth; date.isBefore(now); date = date.add(1, 'day')) {
    const day = date.day()
    if (day !== 0 && day !== 6) {
      // Exclude Sundays (0) and Saturdays (6)
      totalMillisecondsPassed += workingDayMilliseconds
    }
  }
  return totalMillisecondsPassed
}

export const countBusinessDaysBeforeDate = (
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
): number => {
  let businessDays = 0

  for (
    let date = startDate.startOf('day');
    date.isBefore(endDate.startOf('day'));
    date = date.add(1, 'day')
  ) {
    const day = date.day()
    if (day !== 0 && day !== 6) {
      businessDays += 1
    }
  }

  return businessDays
}

export const calculateWorkingHours = (
  startHour: Date | null,
  endHour: Date | null
): string => {
  if (!startHour || !endHour) {
    return '0h 0m'
  }

  const start = dayjs(startHour)
  const end = dayjs(endHour)
  const diffMinutes = end.diff(start, 'minute')
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  return `${hours}h ${minutes}m`
}

export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
