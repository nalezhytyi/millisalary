import { WORKING_HOURS_PER_DAY } from '../constants'

export const parseSalaryInputValue = (value: string) => Number(value)

export const normalizeWorkingDays = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return 1
  }

  return Math.min(value, 31)
}

export const normalizeWorkingHoursPerDay = (value: number) => {
  if (value > 0) {
    return Math.min(value, 24)
  }

  return WORKING_HOURS_PER_DAY
}

export const getEndHourFromStart = (
  startHour: Date,
  workingHoursPerDay: number
) => {
  return new Date(
    startHour.getTime() +
      normalizeWorkingHoursPerDay(workingHoursPerDay) * 60 * 60 * 1000
  )
}

export const calculateWorkingHoursPerDayValue = (
  startHour: Date | null,
  endHour: Date | null
) => {
  if (!startHour || !endHour) {
    return WORKING_HOURS_PER_DAY
  }

  const diffHours = (endHour.getTime() - startHour.getTime()) / (60 * 60 * 1000)

  if (diffHours <= 0) {
    return WORKING_HOURS_PER_DAY
  }

  return Number(diffHours.toFixed(2))
}

export const formatEventTime = (date: Date | null) => {
  if (!date) {
    return null
  }

  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatTimeInputValue = (date: Date | null) => {
  if (!date) {
    return ''
  }

  return [date.getHours(), date.getMinutes()]
    .map((part) => String(part).padStart(2, '0'))
    .join(':')
}

export const parseTimeInputValue = (
  value: string,
  reference: Date | null
) => {
  const match = /^(\d{2}):(\d{2})$/.exec(value)

  if (!match) {
    return null
  }

  const [, hours, minutes] = match
  const result = reference ? new Date(reference) : new Date()

  result.setHours(Number(hours), Number(minutes), 0, 0)

  return result
}

export const getNextStartAndEndHours = (
  nextStartHour: Date | null,
  currentEndHour: Date | null,
  workingHoursPerDay: number
) => {
  if (nextStartHour) {
    return {
      startHour: nextStartHour,
      endHour: getEndHourFromStart(nextStartHour, workingHoursPerDay),
    }
  }

  return {
    startHour: nextStartHour,
    endHour: currentEndHour,
  }
}

export const getNextEndAndStartHours = (
  nextEndHour: Date | null,
  currentStartHour: Date | null
) => {
  if (
    nextEndHour &&
    currentStartHour &&
    nextEndHour.getTime() < currentStartHour.getTime()
  ) {
    return {
      startHour: nextEndHour,
      endHour: nextEndHour,
    }
  }

  return {
    startHour: currentStartHour,
    endHour: nextEndHour,
  }
}
