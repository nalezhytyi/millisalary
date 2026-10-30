import { FC } from 'react'
import {
  formatTimeInputValue,
  parseTimeInputValue,
} from '../../utils/salaryForm'
import './TimePicker.css'

const TimePicker: FC<{
  label: string
  selected: Date | null
  onChange: (date: Date | null) => void
}> = ({ label, selected, onChange }) => (
  <input
    type="time"
    step={60}
    aria-label={label}
    value={formatTimeInputValue(selected)}
    onChange={(event) =>
      onChange(parseTimeInputValue(event.target.value, selected))
    }
    className="time-picker-input h-[52px] min-w-0 bg-transparent text-body text-foreground"
  />
)

export default TimePicker
