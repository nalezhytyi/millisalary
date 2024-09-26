import { FC } from 'react'
import DatePicker from 'react-datepicker'

const TimePicker: FC<{
  label: string
  selected: Date | null
  onChange: (date: Date | null) => void
}> = ({ label, selected, onChange }) => (
  <div className="flex-1">
    <label className="mb-2 block text-gray-300">{label}</label>
    <DatePicker
      selected={selected}
      onChange={onChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={30}
      timeCaption={label}
      dateFormat="HH:mm"
      timeFormat="HH:mm"
      className="w-full rounded border border-gray-200/20 bg-gray-400/10 p-2 outline-gray-200/20"
    />
  </div>
)

export default TimePicker
