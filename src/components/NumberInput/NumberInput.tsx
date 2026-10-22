import { useState } from 'react'
import { Input } from '@/components/ui/input'

type NumberInputProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'value' | 'onChange'
> & {
  value: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

// While focused the field shows exactly what was typed, so it can be cleared
// mid-edit. Only complete values are committed: an empty field, or one below
// `min` (the "0" on the way to "0.5"), stays a draft and the saved value comes
// back on blur. Selects the value on focus.
const NumberInput = ({
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}: NumberInputProps) => {
  const [draft, setDraft] = useState<string | null>(null)

  return (
    <Input
      {...props}
      type="number"
      value={draft ?? value}
      onFocus={(event) => {
        setDraft(String(value))
        event.target.select()
        onFocus?.(event)
      }}
      onChange={(event) => {
        const { value: raw } = event.target
        const parsed = Number(raw)

        setDraft(raw)
        if (
          raw !== '' &&
          Number.isFinite(parsed) &&
          (props.min === undefined || parsed >= Number(props.min))
        ) {
          onChange(event)
        }
      }}
      onBlur={(event) => {
        setDraft(null)
        onBlur?.(event)
      }}
    />
  )
}

export default NumberInput
