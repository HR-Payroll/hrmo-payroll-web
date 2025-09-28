import { toZonedTime, format } from "date-fns-tz";
import { subHours, toDate } from "date-fns";

export const stringToDate = (date: string) => {
  const [datePart, timePart] = date.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
};

export const dateQuery = (from?: string, to?: string) => {
  const currentDate = new Date();
  const day1 = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
    0,
    0,
    0
  );
  const day15 = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    15,
    0,
    0,
    0
  );

  const dateFrom = from
    ? new Date(
        new Date(from).getFullYear(),
        new Date(from).getMonth(),
        new Date(from).getDate(),
        0,
        0,
        0
      )
    : currentDate.getDate() >= 15
    ? day15
    : day1;
  const dateTo = to
    ? new Date(
        new Date(to).getFullYear(),
        new Date(to).getMonth(),
        new Date(to).getDate(),
        23,
        59,
        59
      )
    : currentDate;

  return { currentDate, dateFrom, dateTo };
};

const TIMEZONE = "Asia/Manila";

export const dateTz = (date: Date | string): Date => {
  const d = typeof date === "string" ? new Date(date) : date;
  // Always convert to Asia/Manila time regardless of server timezone
  return toZonedTime(d, TIMEZONE);
};

export function formatTime(
  date: Date | string,
  pattern = "yyyy-MM-dd hh:mmaaa"
) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, pattern, { timeZone: TIMEZONE });
}

export const dateTzUTC = (date: Date): Date => {
  return toDate(date);
};

// export const dateTzUTC = (date: Date): Date => {
//   return utcToZonedTime(utcDate, 'Asia/Manila');
// }
