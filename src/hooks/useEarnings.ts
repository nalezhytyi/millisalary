import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { fetchExchangeRate } from '../api'
import { WORKING_DAYS, WORKING_HOURS_PER_DAY } from '../constants'
import {
  calculateMillisecondsPastToday,
  countBusinessDaysBeforeDate,
  getWorkingDayMilliseconds,
} from '../utils/calculations'

export const useEarnings = (
  monthlySalary: number,
  monthlySalaryCurrency: string,
  earningsCurrency: string,
  startHour: Date | null,
  endHour: Date | null,
  workingDays: number,
  workingHoursPerDay: number
) => {
  const [currentEarnings, setCurrentEarnings] = useState<number>(0)
  const [monthEarnings, setMonthEarnings] = useState<number>(0)
  const [dayEarnings, setDayEarnings] = useState<number>(0)
  const [totalDayEarnings, setTotalDayEarnings] = useState<number>(0)
  const [exchangeRate, setExchangeRate] = useState<number>(1)

  useEffect(() => {
    const updateExchangeRate = async () => {
      try {
        const rate = await fetchExchangeRate(
          monthlySalaryCurrency,
          earningsCurrency
        )
        setExchangeRate(rate)
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error)
      }
    }

    updateExchangeRate()
  }, [monthlySalaryCurrency, earningsCurrency])

  useEffect(() => {
    const updateEarnings = () => {
      const now = dayjs()
      const startOfDay = dayjs(startHour)
      const endOfDay = dayjs(endHour)
      const startOfMonth = now.startOf('month')
      const startOfToday = now.startOf('day')
      const safeWorkingDays = workingDays > 0 ? workingDays : WORKING_DAYS
      const safeWorkingHoursPerDay =
        workingHoursPerDay > 0 ? workingHoursPerDay : WORKING_HOURS_PER_DAY
      const workingDayMilliseconds = getWorkingDayMilliseconds(
        startHour,
        endHour,
        safeWorkingHoursPerDay
      )
      const dailySalary =
        safeWorkingDays > 0 ? monthlySalary / safeWorkingDays : 0
      const millisecondSalary =
        workingDayMilliseconds > 0 ? dailySalary / workingDayMilliseconds : 0
      const completedBusinessDays = countBusinessDaysBeforeDate(
        startOfMonth,
        startOfToday
      )
      const completedScheduledDays = Math.min(
        completedBusinessDays,
        safeWorkingDays
      )
      const isBusinessDayToday = now.day() !== 0 && now.day() !== 6
      const isScheduledWorkingDayToday =
        isBusinessDayToday && completedBusinessDays < safeWorkingDays

      const millisecondsPastToday = isScheduledWorkingDayToday
        ? calculateMillisecondsPastToday(now, startOfDay, endOfDay)
        : 0
      const estimatedEarnings = Math.min(
        monthlySalary,
        completedScheduledDays * dailySalary +
          millisecondSalary * millisecondsPastToday
      )
      const estimatedDayEarnings = millisecondSalary * millisecondsPastToday

      setCurrentEarnings(estimatedEarnings * exchangeRate)
      setMonthEarnings(monthlySalary * exchangeRate)
      setDayEarnings(estimatedDayEarnings * exchangeRate)
      setTotalDayEarnings(dailySalary * exchangeRate)
    }

    const timer = setInterval(updateEarnings, 100)

    return () => clearInterval(timer)
  }, [
    monthlySalary,
    startHour,
    endHour,
    exchangeRate,
    workingDays,
    workingHoursPerDay,
  ])

  return {
    currentEarnings,
    monthEarnings,
    dayEarnings,
    totalDayEarnings,
    exchangeRate,
  }
}
