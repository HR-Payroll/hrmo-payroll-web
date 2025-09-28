import moment from "moment-timezone";

export const dateQuery = (from?: string, to?: string) => {
  const now = moment.tz("Asia/Manila");
  const day1 = now.clone().startOf("month");
  const day15 = now.clone().date(15).startOf("day");

  const baseFrom = from
    ? moment.tz(from, "Asia/Manila")
    : now.date() >= 15
    ? day15
    : day1;

  const baseTo = to ? moment.tz(to, "Asia/Manila") : now;

  return {
    currentDate: now.toDate(),
    dateFrom: baseFrom.startOf("day").toDate(), // Manila start-of-day converted to UTC Date
    dateTo: baseTo.endOf("day").toDate(), // Manila end-of-day converted to UTC Date
  };
};

// const TIMEZONE = "Asia/Manila";

// export const dateTz = (date: Date | string): Date => {
//   const d = typeof date === "string" ? new Date(date) : date;
//   // Always convert to Asia/Manila time regardless of server timezone
//   return toZonedTime(d, TIMEZONE);
// };

export function formatTime(
  date: Date | string,
  pattern = "YYYY-MM-DD HH:mm:ss"
) {
  if (!date) return "";

  const utcMoment = moment.utc(date, "YYYY-MM-DD HH:mm:ss");
  return utcMoment.tz("Asia/Manila").format(pattern);
}

// export const dateTzUTC = (date: Date): Date => {
//   return toDate(date);
// };

// export const dateTzUTC = (date: Date): Date => {
//   return utcToZonedTime(utcDate, 'Asia/Manila');
// }
