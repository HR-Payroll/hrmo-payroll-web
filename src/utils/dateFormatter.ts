import moment from "moment-timezone";

export const dateQuery = (from?: string, to?: string) => {
  const now = moment();
  const day1 = now.clone().startOf("month");
  const day15 = now.clone().date(15).startOf("day");

  const baseFrom = from ? moment(from) : now.date() >= 15 ? day15 : day1;
  const baseTo = to ? moment(to) : now;

  return {
    currentDate: now.toDate(),
    dateFrom: baseFrom.startOf("day").toDate(),
    dateTo: baseTo.endOf("day").toDate(),
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

  const utcMoment = moment(date, "YYYY-MM-DD HH:mm:ss");
  return utcMoment.format(pattern);
}

// export const dateTzUTC = (date: Date): Date => {
//   return toDate(date);
// };

// export const dateTzUTC = (date: Date): Date => {
//   return utcToZonedTime(utcDate, 'Asia/Manila');
// }
