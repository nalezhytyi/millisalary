import dayjs from 'dayjs'
import { WORKING_DAYS, WORKING_HOURS_PER_DAY } from '../constants'
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

export interface EarningsSettings {
  monthlySalary: number
  workingDays: number
  workingHoursPerDay: number
  startHour: Date | null
  endHour: Date | null
  /** Day of month (1-31); clamped to the month length */
  payday: number
  /** Multiplier from the salary currency to the display currency */
  exchangeRate: number
}

export interface PeriodEarnings {
  earned: number
  total: number
}

export interface EarningsSnapshot {
  hour: PeriodEarnings
  day: PeriodEarnings
  week: PeriodEarnings
  month: PeriodEarnings
  year: PeriodEarnings
  rates: {
    perSecond: number
    perMinute: number
    perHour: number
    perDay: number
  }
  nextPayday: {
    date: Date
    daysLeft: number
    isToday: boolean
    amount: number
  }
}

const DEFAULT_START_MINUTES = 9 * 60

const atMinutesOfDay = (day: dayjs.Dayjs, minutes: number) =>
  day
    .startOf('day')
    .hour(Math.floor(minutes / 60))
    .minute(minutes % 60)

const isBusinessDay = (date: dayjs.Dayjs) => date.day() !== 0 && date.day() !== 6

export const getPaydayInMonth = (month: dayjs.Dayjs, payday: number) =>
  month.startOf('month').date(Math.min(payday, month.daysInMonth()))

export const getNextPayday = (today: dayjs.Dayjs, payday: number) => {
  const startOfToday = today.startOf('day')
  const thisMonth = getPaydayInMonth(startOfToday, payday)

  if (!thisMonth.isBefore(startOfToday)) {
    return thisMonth
  }

  return getPaydayInMonth(startOfToday.startOf('month').add(1, 'month'), payday)
}

/**
 * Pure earnings model. Business days are Mon-Fri, a day only counts while the
 * month still has scheduled working days left, and a worked day earns
 * monthlySalary / workingDays spread evenly over the start-end window.
 * Week = Mon-Sun (total is 5 days); year = completed months in full plus the
 * current month. All money outputs are multiplied by `exchangeRate`.
 */
export const calculateEarnings = (
  now: dayjs.Dayjs,
  settings: EarningsSettings
): EarningsSnapshot => {
  const { monthlySalary, exchangeRate, payday } = settings
  const safeWorkingDays = settings.workingDays > 0 ? settings.workingDays : WORKING_DAYS
  const safeWorkingHoursPerDay = normalizeWorkingHoursPerDay(
    settings.workingHoursPerDay
  )

  // Anchor the window to today: stored dates can be from a previous day.
  const startMinutes = settings.startHour
    ? settings.startHour.getHours() * 60 + settings.startHour.getMinutes()
    : DEFAULT_START_MINUTES
  const endMinutes = settings.endHour
    ? settings.endHour.getHours() * 60 + settings.endHour.getMinutes()
    : startMinutes + safeWorkingHoursPerDay * 60
  const windowStart = atMinutesOfDay(now, startMinutes)
  const windowEnd =
    endMinutes > startMinutes
      ? atMinutesOfDay(now, endMinutes)
      : windowStart.add(safeWorkingHoursPerDay, 'hour')
  const workingDayMilliseconds = windowEnd.diff(windowStart)

  const dailySalary = monthlySalary / safeWorkingDays
  const millisecondSalary =
    workingDayMilliseconds > 0 ? dailySalary / workingDayMilliseconds : 0
  const hourlySalary = millisecondSalary * 3600 * 1000

  const isScheduledDay = (date: dayjs.Dayjs) =>
    isBusinessDay(date) &&
    countBusinessDaysBeforeDate(date.startOf('month'), date) < safeWorkingDays

  const startOfToday = now.startOf('day')
  const scheduledToday = isScheduledDay(now)

  const millisecondsPastToday = scheduledToday
    ? calculateMillisecondsPastToday(now, windowStart, windowEnd)
    : 0
  const dayEarned = millisecondSalary * millisecondsPastToday

  const startOfHour = now.startOf('hour')
  const millisecondsPastHour = scheduledToday
    ? Math.max(
        0,
        Math.min(now.valueOf(), windowEnd.valueOf()) -
          Math.max(startOfHour.valueOf(), windowStart.valueOf())
      )
    : 0
  const hourEarned = millisecondSalary * millisecondsPastHour

  const startOfWeek = startOfToday.subtract((now.day() + 6) % 7, 'day')
  let completedWeekDays = 0
  for (
    let date = startOfWeek;
    date.isBefore(startOfToday);
    date = date.add(1, 'day')
  ) {
    if (isScheduledDay(date)) {
      completedWeekDays += 1
    }
  }

  const completedScheduledDays = Math.min(
    countBusinessDaysBeforeDate(now.startOf('month'), startOfToday),
    safeWorkingDays
  )
  const monthEarned = Math.min(
    monthlySalary,
    completedScheduledDays * dailySalary + dayEarned
  )

  const nextPaydayDate = getNextPayday(now, payday)
  const daysLeft = nextPaydayDate.diff(startOfToday, 'day')

  const money = (amount: number) => amount * exchangeRate

  return {
    hour: { earned: money(hourEarned), total: money(hourlySalary) },
    day: { earned: money(dayEarned), total: money(dailySalary) },
    week: {
      earned: money(completedWeekDays * dailySalary + dayEarned),
      total: money(5 * dailySalary),
    },
    month: { earned: money(monthEarned), total: money(monthlySalary) },
    year: {
      earned: money(now.month() * monthlySalary + monthEarned),
      total: money(12 * monthlySalary),
    },
    rates: {
      perSecond: money(millisecondSalary * 1000),
      perMinute: money(millisecondSalary * 60 * 1000),
      perHour: money(hourlySalary),
      perDay: money(dailySalary),
    },
    nextPayday: {
      date: nextPaydayDate.toDate(),
      daysLeft,
      isToday: daysLeft === 0,
      amount: money(monthlySalary),
    },
  }
}

export const formatCurrency = (
  amount: number,
  currency: string,
  fractionDigits = 2
): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
    .format(amount)
    .replace(/\u00A0/g, ' ')
}

export interface CurrencyParts {
  /** Currency symbol or code, e.g. "$" or "грн" */
  symbol: string
  symbolPosition: 'prefix' | 'suffix'
  sign: string
  /** Whole part with group separators */
  integer: string
  decimal: string
  fraction: string
}

export const formatCurrencyParts = (
  amount: number,
  currency: string,
  fractionDigits = 2
): CurrencyParts => {
  const parts = new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).formatToParts(amount)
  const join = (...types: string[]) =>
    parts
      .filter((part) => types.includes(part.type))
      .map((part) => part.value.replace(/\u00A0/g, ' '))
      .join('')

  return {
    symbol: join('currency'),
    symbolPosition:
      parts.findIndex((part) => part.type === 'currency') <
      parts.findIndex((part) => part.type === 'integer')
        ? 'prefix'
        : 'suffix',
    sign: join('minusSign', 'plusSign'),
    integer: join('integer', 'group'),
    decimal: join('decimal'),
    fraction: join('fraction'),
  }
}
