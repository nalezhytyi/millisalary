import { FC } from 'react'
import InfoLabel from '../InfoLabel'
import { formatTimeInputValue, parseTimeInputValue } from '../../utils/salaryForm'
import './TimePicker.css'

const TimePicker: FC<{
  label: string
  infoText?: string
  infoAlign?: 'start' | 'end'
  selected: Date | null
  onChange: (date: Date | null) => void
}> = ({ label, infoText, infoAlign, selected, onChange }) => {
  return (
    <div className="min-w-0 flex-1">
      {infoText ? (
        <InfoLabel
          className="mb-2"
          label={label}
          info={infoText}
          align={infoAlign}
        />
      ) : (
        <label className="mb-2 block text-gray-300">{label}</label>
      )}
      <input
        type="time"
        step={60}
        aria-label={label}
        value={formatTimeInputValue(selected)}
        onChange={(event) =>
          onChange(parseTimeInputValue(event.target.value, selected))
        }
        className="time-picker-input w-full rounded border border-gray-200/20 bg-gray-400/10 p-2 text-gray-200 outline-gray-200/20 backdrop-blur-md"
      />
    </div>
  )
}

export default TimePicker
