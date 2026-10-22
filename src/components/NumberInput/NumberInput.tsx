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
// mid-edit; an empty field isn't committed and the normalized value comes
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
        setDraft(event.target.value)
        if (event.target.value !== '') {
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
