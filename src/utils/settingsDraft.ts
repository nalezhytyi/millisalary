import {
  calculateWorkingHoursPerDayValue,
  formatTimeInputValue,
  getEndHourFromStart,
  getNextEndAndStartHours,
  getNextStartAndEndHours,
  normalizePayday,
  normalizeWorkingDays,
  normalizeWorkingHoursPerDay,
  parseSalaryInputValue,
} from './salaryForm'

// What the Settings screen edits as a draft; nothing reaches storage until
// the user saves
export interface SettingsValues {
  monthlySalary: number
  monthlySalaryCurrency: string
  earningsCurrency: string
  workingHoursPerDay: number
  workingDays: number
  payday: number
  startHour: Date | null
  endHour: Date | null
}

export const withMonthlySalary = (
  values: SettingsValues,
  raw: string
): SettingsValues => ({
  ...values,
  monthlySalary: parseSalaryInputValue(raw),
})

export const withWorkingDays = (
  values: SettingsValues,
  raw: string
): SettingsValues => ({
  ...values,
  workingDays: normalizeWorkingDays(parseSalaryInputValue(raw)),
})

export const withPayday = (
  values: SettingsValues,
  raw: string
): SettingsValues => ({
  ...values,
  payday: normalizePayday(parseSalaryInputValue(raw)),
})

// Editing hours/day moves End
export const withWorkingHoursPerDay = (
  values: SettingsValues,
  raw: string
): SettingsValues => {
  const workingHoursPerDay = normalizeWorkingHoursPerDay(
    parseSalaryInputValue(raw)
  )

  return {
    ...values,
    workingHoursPerDay,
    endHour: values.startHour
      ? getEndHourFromStart(values.startHour, workingHoursPerDay)
      : values.endHour,
  }
}

// Changing Start moves End forward by hours/day
export const withStartHour = (
  values: SettingsValues,
  date: Date | null
): SettingsValues => ({
  ...values,
  ...getNextStartAndEndHours(date, values.endHour, values.workingHoursPerDay),
})

// Changing End recomputes hours/day; an End before Start pulls Start back
export const withEndHour = (
  values: SettingsValues,
  date: Date | null
): SettingsValues => {
  const { startHour, endHour } = getNextEndAndStartHours(date, values.startHour)

  return {
    ...values,
    startHour,
    endHour,
    workingHoursPerDay: calculateWorkingHoursPerDayValue(startHour, endHour),
  }
}

// Names used for the `changed_fields` analytics property
export const getChangedFields = (
  saved: SettingsValues,
  draft: SettingsValues
) => {
  const changed: string[] = []

  if (draft.monthlySalary !== saved.monthlySalary) {
    changed.push('monthly_salary')
  }
  if (draft.monthlySalaryCurrency !== saved.monthlySalaryCurrency) {
    changed.push('monthly_salary_currency')
  }
  if (draft.earningsCurrency !== saved.earningsCurrency) {
    changed.push('earnings_currency')
  }
  if (draft.workingDays !== saved.workingDays) {
    changed.push('working_days')
  }
  if (draft.workingHoursPerDay !== saved.workingHoursPerDay) {
    changed.push('working_hours_per_day')
  }
  if (
    formatTimeInputValue(draft.startHour) !==
    formatTimeInputValue(saved.startHour)
  ) {
    changed.push('start_time')
  }
  if (
    formatTimeInputValue(draft.endHour) !== formatTimeInputValue(saved.endHour)
  ) {
    changed.push('end_time')
  }
  if (draft.payday !== saved.payday) {
    changed.push('payday')
  }

  return changed
}
