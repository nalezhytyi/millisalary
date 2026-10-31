import ListGroup from '@/components/ListGroup'
import NavScreen from '@/components/NavScreen'
import { CheckmarkSymbol } from '@/components/SFSymbol'
import { cn } from '@/lib/utils'

interface ChoiceScreenProps<T extends string> {
  open: boolean
  onClose: () => void
  /** The browser went forward to this page after it closed */
  onReopen: () => void
  title: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  footer?: string
}

// A pushed page that picks one value, like the pages behind a row with a
// chevron in iOS Settings: the options in one card, the chosen one with an
// accent checkmark. Picking only reports the value; the page stays open.
// Like a table cell, a row greys at once when pressed and fades back after
// the tap, and the checkmark cross-fades to the new row instead of jumping
const ChoiceScreen = <T extends string>({
  open,
  onClose,
  onReopen,
  title,
  options,
  value,
  onChange,
  footer,
}: ChoiceScreenProps<T>) => (
  <NavScreen open={open} onClose={onClose} onReopen={onReopen} title={title}>
    <ListGroup footer={footer}>
      <div role="radiogroup" aria-label={title}>
        {options.map((option) => {
          const checked = option.value === value

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onChange(option.value)}
              className="relative flex min-h-[52px] w-full items-center justify-between gap-4 px-4 text-left text-body outline-none [-webkit-tap-highlight-color:transparent] after:absolute after:right-4 after:bottom-0 after:left-4 after:h-[0.5px] after:bg-border last:after:hidden focus-visible:bg-fill-tertiary active:bg-fill-primary active:duration-0 motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-out"
            >
              {option.label}
              <span
                className={cn(
                  'text-primary motion-safe:transition-[opacity,scale] motion-safe:duration-200 motion-safe:ease-out',
                  checked ? 'scale-85 opacity-100' : 'scale-50 opacity-0'
                )}
              >
                <CheckmarkSymbol />
              </span>
            </button>
          )
        })}
      </div>
    </ListGroup>
  </NavScreen>
)

export default ChoiceScreen
