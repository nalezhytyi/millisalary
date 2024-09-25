import dayjs from "dayjs";
import { WORKING_HOURS_PER_DAY } from "../constants";

export const calculateMillisecondsPastToday = (
  now: dayjs.Dayjs,
  startOfDay: dayjs.Dayjs,
  endOfDay: dayjs.Dayjs
): number => {
  if (now.isAfter(startOfDay) && now.isBefore(endOfDay)) {
    return now.diff(startOfDay);
  } else if (now.isAfter(endOfDay)) {
    return endOfDay.diff(startOfDay);
  }
  return 0;
};

export const calculateTotalMillisecondsPassed = (
  now: dayjs.Dayjs,
  startOfMonth: dayjs.Dayjs
): number => {
  let totalMillisecondsPassed = 0;
  for (let date = startOfMonth; date.isBefore(now); date = date.add(1, "day")) {
    const day = date.day();
    if (day !== 0 && day !== 6) {
      // Exclude Sundays (0) and Saturdays (6)
      totalMillisecondsPassed += WORKING_HOURS_PER_DAY * 3600 * 1000;
    }
  }
  return totalMillisecondsPassed;
};

export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};