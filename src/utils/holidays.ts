var Holidays = require("date-holidays");
var hd = new Holidays("PH");
var moment = require("moment-business-days");

export const getHolidaysAPI = (from: Date, to: Date) => {
  const year = new Date().getFullYear();
  return hd
    .getHolidays(year)
    .filter((holiday: any) => holiday.start >= from && holiday.end <= to);
};

export const getBusinessDays = (from: Date, to: Date) => {
  from = new Date(from);
  to = new Date(to);

  moment.updateLocale("ph");
  const businessDays = moment(from).businessDiff(
    moment(to.setDate(to.getDate()))
  );

  return businessDays;
};
