import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { WORKING_HOURS_PER_DAY, WORKING_DAYS } from './constants'
import {
  calculateMillisecondsPastToday,
  calculateTotalMillisecondsPassed,
} from './utils/calculations'
import { fetchExchangeRate } from './api'

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const savedValue = localStorage.getItem(key)
    return savedValue ? (JSON.parse(savedValue) as T) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}

export const useEarnings = (
  monthlySalary: number,
  monthlySalaryCurrency: string,
  earningsCurrency: string,
  startHour: Date | null,
  endHour: Date | null
) => {
  const [currentEarnings, setCurrentEarnings] = useState<number>(0)
  const [monthEarnings, setMonthEarnings] = useState<number>(0)
  const [dayEarnings, setDayEarnings] = useState<number>(0)
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

      const dailySalary = monthlySalary / WORKING_DAYS
      const hourlySalary = dailySalary / WORKING_HOURS_PER_DAY
      const secondSalary = hourlySalary / 3600
      const millisecondSalary = secondSalary / 1000

      const millisecondsPastToday = calculateMillisecondsPastToday(
        now,
        startOfDay,
        endOfDay
      )
      const totalMillisecondsPassed =
        calculateTotalMillisecondsPassed(now, startOfMonth) +
        millisecondsPastToday

      const estimatedEarnings = millisecondSalary * totalMillisecondsPassed
      const estimatedDayEarnings = millisecondSalary * millisecondsPastToday

      setCurrentEarnings(estimatedEarnings * exchangeRate)
      setMonthEarnings(dailySalary * WORKING_DAYS * exchangeRate)
      setDayEarnings(estimatedDayEarnings * exchangeRate)
    }

    const timer = setInterval(updateEarnings, 100)

    return () => clearInterval(timer)
  }, [monthlySalary, startHour, endHour, exchangeRate])

  return { currentEarnings, monthEarnings, dayEarnings, exchangeRate }
}
