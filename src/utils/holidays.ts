import Holidays from "date-holidays";
import moment from "moment-business-days";

const hd = new Holidays("PH");

export const getHolidaysAPI = (from: Date, to: Date) => {
  const year = new Date().getFullYear();
  return hd
    .getHolidays(year)
    .filter((holiday: any) => holiday.start >= from && holiday.end <= to);
};

export const getBusinessDays = (from: Date, to: Date) => {
  from = new Date(from);
  to = new Date(to);

  moment.updateLocale("ph", {});
  const businessDays = moment(moment(from)).businessDiff(
    moment(to.setHours(to.getHours()))
  );

  return businessDays;
};

export const getTotalHolidays = (events: any[]) => {
  const holidays = events
    .filter((event) => event.applied)
    .reduce((sum: number, num: any) => sum + num.rule, 0);

  return holidays || 0;
};
