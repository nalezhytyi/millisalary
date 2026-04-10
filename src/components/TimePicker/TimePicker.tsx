import { FC } from 'react'
import DatePicker from 'react-datepicker'
import InfoLabel from '../InfoLabel'

const TimePicker: FC<{
  label: string
  infoText?: string
  selected: Date | null
  onChange: (date: Date | null) => void
}> = ({ label, infoText, selected, onChange }) => {
  const onDatepickerRef = (el: DatePicker | null) => {
    if (
      el &&
      el.input &&
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ) {
      el.input.setAttribute('readOnly', 'true')
    }
  }
  return (
    <div className="flex-1">
      {infoText ? (
        <InfoLabel className="mb-2" label={label} info={infoText} />
      ) : (
        <label className="mb-2 block text-gray-300">{label}</label>
      )}
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={30}
        timeCaption={label}
        dateFormat="HH:mm"
        timeFormat="HH:mm"
        ref={(el) => onDatepickerRef(el)}
        wrapperClassName="w-full"
        className="w-full rounded border border-gray-200/20 bg-gray-400/10 p-2 text-gray-200 outline-gray-200/20 backdrop-blur-md"
      />
    </div>
  )
}

export default TimePicker
