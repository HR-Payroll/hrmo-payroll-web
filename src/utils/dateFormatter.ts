import { toZonedTime, format, toDate } from "date-fns-tz";
import { subHours } from "date-fns";

export const stringToDate = (date: string) => {
  const [datePart, timePart] = date.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
};

export const dateQuery = (from?: string, to?: string) => {
  const currentDate = new Date();
  const day1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const day15 = new Date(currentDate.getFullYear(), currentDate.getMonth(), 15);

  const dateFrom = from
    ? new Date(
        new Date(from).getFullYear(),
        new Date(from).getMonth(),
        new Date(from).getDate()
      )
    : currentDate.getDate() >= 15
    ? day15
    : day1;
  const dateTo = to
    ? new Date(
        new Date(to).getFullYear(),
        new Date(to).getMonth(),
        new Date(to).getDate()
      )
    : currentDate;

  return { currentDate, dateFrom, dateTo };
};

const TIMEZONE = "Asia/Manila";

export const dateTz = (date: Date): Date => {
  return toDate(date, { timeZone: TIMEZONE });
};

export function formatTime(
  date: Date | string,
  pattern = "yyyy-MM-dd hh:mmaaa"
) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(subHours(d, 8), pattern, { timeZone: TIMEZONE });
}
