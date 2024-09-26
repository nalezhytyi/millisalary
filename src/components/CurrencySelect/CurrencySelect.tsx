interface CurrencySelectProps {
  selectedCurrency: string
  onCurrencyChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  label?: string
  className?: string
}

const CURRENCIES = ['UAH', 'USD', 'EUR', 'PLN', 'CZK', 'RON']

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  selectedCurrency,
  onCurrencyChange,
  label,
  className,
}) => {
  return (
    <div className={className}>
      {label && <label className="mb-2 block text-gray-300">{label}</label>}
      <select
        value={selectedCurrency}
        onChange={onCurrencyChange}
        className="form-select w-full cursor-pointer appearance-none rounded border border-gray-200/20 bg-gray-400/10 p-2 pr-8 outline-gray-200/20"
        style={{
          backgroundSize: '0.7rem',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.7rem center',
          backgroundImage: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAABGdBTUEAALGPC/xhBQAAAQtJREFUOBG1lEEOgjAQRalbGj2OG9caOACn4ALGtfEuHACiazceR1PWOH/CNA3aMiTaBDpt/7zPdBKy7M/DCL9pGkvxxVp7KsvyJftL5rZt1865M+Ucq6pyyF3hNcI7Cuu+728QYn/JQA5yKaempxuZmQngOwEaYx55nu+1lQh8GIatMGi+01NwBcEmhxBqK4nAPZJ78K0KKFAJmR3oPp8+Iwgob0Oa6+TLoeCvRx+mTUYf/FVBGTPRwDkfLxnaSrRwcH0FWhNOmrkWYbE2XEicqgSa1J0LQ+aPCuQgZiLnwewbGuz5MGoAhcIkCQcjaTBjMgtXGURMVHC1wcQEy0J+Zlj8bKAnY1/UzDe2dbAVqfXn6wAAAABJRU5ErkJggg==')`,
        }}
      >
        {CURRENCIES.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CurrencySelect
