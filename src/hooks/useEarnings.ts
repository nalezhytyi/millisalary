import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { fetchExchangeRate } from '../api'
import {
  calculateEarnings,
  PERIODS,
  type EarningsSettings,
  type EarningsSnapshot,
} from '../utils/calculations'

const EXCHANGE_RATES_KEY = 'exchangeRates'

// Last known rate per "FROM>TO" pair, so a reload or an offline launch keeps
// converting instead of falling back to 1
const readCachedRate = (pair: string): number | null => {
  try {
    const rates = JSON.parse(localStorage.getItem(EXCHANGE_RATES_KEY) ?? '{}')
    const rate = rates[pair]

    return typeof rate === 'number' && Number.isFinite(rate) ? rate : null
  } catch {
    return null
  }
}

const writeCachedRate = (pair: string, rate: number) => {
  try {
    const rates = JSON.parse(localStorage.getItem(EXCHANGE_RATES_KEY) ?? '{}')

    localStorage.setItem(
      EXCHANGE_RATES_KEY,
      JSON.stringify({ ...rates, [pair]: rate })
    )
  } catch {
    // Storage unavailable: the rate still applies for this session
  }
}

// The tick runs every 100 ms; skip the re-render when nothing moved
// (outside working hours, weekends, no salary)
const isSameSnapshot = (a: EarningsSnapshot, b: EarningsSnapshot) =>
  PERIODS.every(
    (key) => a[key].earned === b[key].earned && a[key].total === b[key].total
  ) &&
  a.rates.perSecond === b.rates.perSecond &&
  a.nextPayday.daysLeft === b.nextPayday.daysLeft &&
  a.nextPayday.amount === b.nextPayday.amount

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
  const pair = `${monthlySalaryCurrency}>${earningsCurrency}`
  const isSameCurrency = monthlySalaryCurrency === earningsCurrency
  const [fetchedRate, setFetchedRate] = useState<{
    pair: string
    rate: number
  } | null>(null)

  // A rate only ever applies to the pair it was fetched for
  const exchangeRate = useMemo(() => {
    if (isSameCurrency) {
      return 1
    }
    if (fetchedRate?.pair === pair) {
      return fetchedRate.rate
    }

    return readCachedRate(pair) ?? 1
  }, [isSameCurrency, fetchedRate, pair])

  const [earnings, setEarnings] = useState(() =>
    calculateEarnings(dayjs(), {
      monthlySalary,
      workingDays,
      workingHoursPerDay,
      startHour,
      endHour,
      payday,
      exchangeRate,
    })
  )

  useEffect(() => {
    if (isSameCurrency) {
      return
    }

    // Ignore responses for a pair the user has already switched away from
    let isCurrent = true

    fetchExchangeRate(monthlySalaryCurrency, earningsCurrency)
      .then((rate) => {
        if (!isCurrent || !Number.isFinite(rate)) {
          return
        }
        writeCachedRate(pair, rate)
        setFetchedRate({ pair, rate })
      })
      .catch((error) => {
        console.error('Failed to fetch exchange rate:', error)
      })

    return () => {
      isCurrent = false
    }
  }, [isSameCurrency, monthlySalaryCurrency, earningsCurrency, pair])

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
    const updateEarnings = () => {
      const next = calculateEarnings(dayjs(), settings)

      setEarnings((previous) =>
        isSameSnapshot(previous, next) ? previous : next
      )
    }

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
