import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'

interface CurrencySelectProps {
  selectedCurrency: string
  onCurrencyChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  'aria-label': string
}

const CURRENCIES = ['UAH', 'USD', 'EUR', 'PLN', 'CZK', 'RON']

// Native <select> so iOS shows the system wheel; styled as a trailing value
// without the web focus ring (Safari shows it on tap too), like the other rows
const CurrencySelect: React.FC<CurrencySelectProps> = ({
  selectedCurrency,
  onCurrencyChange,
  'aria-label': ariaLabel,
}) => (
  <NativeSelect
    aria-label={ariaLabel}
    value={selectedCurrency}
    onChange={onCurrencyChange}
    className="[&_select]:h-11 [&_select]:border-0 [&_select]:bg-transparent [&_select]:pr-6 [&_select]:pl-0 [&_select]:text-right [&_select]:text-[17px] [&_select]:text-muted-foreground [&_select]:focus-visible:ring-0 dark:[&_select]:bg-transparent [&_svg]:right-0"
  >
    {CURRENCIES.map((currency) => (
      <NativeSelectOption key={currency} value={currency}>
        {currency}
      </NativeSelectOption>
    ))}
  </NativeSelect>
)

export default CurrencySelect
