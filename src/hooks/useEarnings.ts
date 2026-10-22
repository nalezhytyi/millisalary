import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { fetchExchangeRate } from '../api'
import {
  calculateEarnings,
  type EarningsSettings,
} from '../utils/calculations'

export const useEarnings = (
  monthlySalary: number,
  monthlySalaryCurrency: string,
  earningsCurrency: string,
  startHour: Date | null,
  endHour: Date | null,
  workingDays: number,
  workingHoursPerDay: number,
  payday: number
) => {
  const [exchangeRate, setExchangeRate] = useState<number>(1)
  const [earnings, setEarnings] = useState(() =>
    calculateEarnings(dayjs(), {
      monthlySalary,
      workingDays,
      workingHoursPerDay,
      startHour,
      endHour,
      payday,
      exchangeRate: 1,
    })
  )

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
    const settings: EarningsSettings = {
      monthlySalary,
      workingDays,
      workingHoursPerDay,
      startHour,
      endHour,
      payday,
      exchangeRate,
    }
    const updateEarnings = () => setEarnings(calculateEarnings(dayjs(), settings))

    updateEarnings()
    const timer = setInterval(updateEarnings, 100)

    return () => clearInterval(timer)
  }, [
    monthlySalary,
    startHour,
    endHour,
    exchangeRate,
    workingDays,
    workingHoursPerDay,
    payday,
  ])

  return { earnings, exchangeRate }
}
