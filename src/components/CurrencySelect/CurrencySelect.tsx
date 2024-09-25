interface CurrencySelectProps {
  selectedCurrency: string
  onCurrencyChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  label?: string
  className?: string
}

const CURRENCIES = ['UAH', 'USD', 'EUR', 'PLN', 'CZK']

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
        className="w-full cursor-pointer rounded border-r-8 border-transparent p-2 outline outline-gray-200/20"
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
