import React, { useEffect, useState } from 'react'
import { formatCurrency, formatCurrencyParts } from '@/utils/calculations'
import type { Period } from '@/utils/calculations'
import './EarningsDial.css'

interface EarningsDialProps {
  earned: number
  total: number
  currency: string
  period: Period
}

const PERIOD_CAPTION: Record<Period, string> = {
  hour: 'per hour',
  day: 'today',
  week: 'this week',
  month: 'this month',
  year: 'this year',
}

const RADIUS = 44
const BIG_FRACTION_DIGITS = 2

const EarningsDial: React.FC<EarningsDialProps> = ({
  earned,
  total,
  currency,
  period,
}) => {
  const progress = total > 0 ? Math.min(1, Math.max(0, earned / total)) : 0
  // Start from an empty ring so the arc grows in on first paint
  const [hasMounted, setHasMounted] = useState(false)
  const shownProgress = hasMounted ? progress : 0
  // The arc only animates on mount and on a period switch; the 100 ms ticks
  // in between apply directly instead of restarting a transition each time
  const [animatedPeriod, setAnimatedPeriod] = useState(period)
  const [isAnimating, setIsAnimating] = useState(true)

  if (period !== animatedPeriod) {
    // Same render as the new value, so the transition class is already there
    setAnimatedPeriod(period)
    setIsAnimating(true)
  }

  useEffect(() => {
    // A timer, not requestAnimationFrame: rAF doesn't run in a hidden tab,
    // which would leave the ring empty until the tab is shown
    const timer = setTimeout(() => setHasMounted(true), 50)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isAnimating) {
      return
    }

    // A bit longer than the 700 ms transition in EarningsDial.css
    const timer = setTimeout(() => setIsAnimating(false), 800)

    return () => clearTimeout(timer)
  }, [isAnimating, animatedPeriod])

  const parts = formatCurrencyParts(earned, currency, 4)
  const bigFraction = parts.fraction.slice(0, BIG_FRACTION_DIGITS)
  const smallFraction = parts.fraction.slice(BIG_FRACTION_DIGITS)
  // Fit the amount inside the dial: roughly 0.58em per glyph in ~60% of its width
  const glyphs =
    parts.integer.length +
    1 +
    bigFraction.length +
    smallFraction.length * 0.6 +
    (parts.symbol.length + 1) * 0.7
  const fontSize = Math.min(17, 60 / (glyphs * 0.58))
  const symbol = (
    <span className="text-primary" style={{ fontSize: '0.7em' }}>
      {parts.symbol}
    </span>
  )

  return (
    <div
      className="relative aspect-square w-full"
      style={{
        containerType: 'inline-size',
        maxWidth: 'clamp(13rem, calc(100dvh - 24rem), 24rem)',
      }}
      role="img"
      aria-label={`${formatCurrency(earned, currency)} earned ${PERIOD_CAPTION[period]}, ${Math.round(progress * 100)}% of ${formatCurrency(total, currency)}`}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="6"
          className="stroke-secondary"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${shownProgress * 100} 100`}
          transform="rotate(-90 50 50)"
          className={`stroke-primary ${isAnimating ? 'earnings-dial-arc-animated' : ''}`}
          style={{ opacity: shownProgress > 0 ? 1 : 0 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[2cqw] text-center">
        {/* Animated face; the static PNG (433×480, not square, hence
            object-contain) when the user prefers reduced motion */}
        <picture className="contents">
          <source
            srcSet={`${import.meta.env.BASE_URL}images/money-face.png`}
            media="(prefers-reduced-motion: reduce)"
          />
          <img
            src={`${import.meta.env.BASE_URL}images/money-face.webp`}
            alt=""
            data-dial-face
            className="size-[16cqw] object-contain"
            draggable={false}
          />
        </picture>
        <div
          className="leading-none font-semibold whitespace-nowrap"
          style={{ fontSize: `${fontSize}cqw` }}
        >
          {parts.symbolPosition === 'prefix' && symbol}
          {parts.sign}
          {parts.integer}
          {parts.decimal}
          {bigFraction}
          <span
            className="text-muted-foreground"
            style={{ fontSize: '0.62em' }}
          >
            {smallFraction}
          </span>
          {parts.symbolPosition === 'suffix' && <> {symbol}</>}
        </div>
        <p className="max-w-[62cqw] text-[3.8cqw] text-muted-foreground">
          of {formatCurrency(total, currency)} {PERIOD_CAPTION[period]}
        </p>
      </div>
    </div>
  )
}

export default React.memo(EarningsDial)
