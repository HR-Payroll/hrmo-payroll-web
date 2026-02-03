import { format } from "date-fns";
import { getBusinessDays, getTotalHolidays } from "./holidays";
import { REGULAR_SCHEDULE } from "@/data/constants";
import moment from "moment-business-days";
import { Schedule } from "@/types";

export const computeTotalDaysAndLate = ({
  dates,
  settings,
  employee,
  businessDays = 10,
  filter,
}: {
  dates: any[];
  settings: any;
  employee?: Employee;
  businessDays?: number;
  filter: { from: Date; to: Date };
}) => {
  const days = dates
    .map((item: any) => item.timestamp)
    .reduce((acc: any, dateTime: any) => {
      const date = format(
        moment.tz(dateTime, "Asia/Manila").toDate(),
        "yyyy-MM-dd HH:mm:ss"
      ).split(" ")[0];
      acc[date] = acc[date] || [];
      acc[date].push(new Date(dateTime));
      return acc;
    }, {});

  const gracePeriod = settings.gracePeriod || 10;
  let schedule: Schedule = employee?.schedule || REGULAR_SCHEDULE;
  if (typeof schedule.daysIncluded === "string") {
    try {
      schedule = {
        ...schedule,
        daysIncluded: JSON.parse(schedule.daysIncluded),
      };
    } catch (e) {
      schedule = { ...schedule, daysIncluded: [] };
    }
  }

  Object.keys(days).forEach((date) => {
    const dayOfWeek = new Date(date).getDay();

    if (!schedule.daysIncluded.map((d) => d.value).includes(dayOfWeek)) {
      delete days[date];
    }
  });

  let inOut: any[] = [];

  if (schedule.option !== "Straight Time") {
    inOut = Object.keys(days).map((date) => {
      const times = days[date].sort(
        (a: Date, b: Date) => a.getTime() - b.getTime()
      );

      return regularComputation(date, schedule, times, gracePeriod);
    }) as any;

    const total = inOut.reduce(
      (sum: number, num: any) => sum + num.totalDays,
      0
    );
    const late = inOut.reduce((sum: number, num: any) => sum + num.late, 0);
    const lateDeductions = inOut.reduce(
      (sum: number, num: any) => sum + num.deductions,
      0
    );

    //temporary calculations
    let earnings = 0;

    if (
      employee &&
      employee.type === "MONTHLY" &&
      typeof employee.rate === "number"
    ) {
      // earnings = Math.min(
      //   (employee.rate / 2 / businessDays) * total,
      //   employee.rate / 2
      // );

      // earnings = employee.rate / 2;

      const from = new Date(filter.from);
      const to = new Date(filter.to);
      const daysInRange =
        (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1;

      const daysInMonth = new Date(
        from.getFullYear(),
        from.getMonth() + 1,
        0
      ).getDate();
      const rate = typeof employee.rate === "number" ? employee.rate : 0;

      earnings = rate * (daysInRange / daysInMonth);
    } else if (employee && typeof employee.rate === "number") {
      earnings = total * employee.rate;
    } else {
      earnings = 0;
    }

    const deductions = employee
      ? getTotalDeduction(employee) + lateDeductions
      : 0;
    const net = earnings - deductions;

    return {
      totalDays: total % 1 === 0 ? total.toFixed(0) : total.toFixed(2),
      late: late % 1 === 0 ? late.toFixed(0) : late.toFixed(1),
      earnings: earnings % 1 === 0 ? earnings.toFixed(0) : earnings.toFixed(2),
      deductions:
        deductions % 1 === 0 ? deductions.toFixed(0) : deductions.toFixed(2),
      net: net % 1 === 0 ? net.toFixed(0) : net.toFixed(2),
    };
  } else {
    const dateKeys = Object.keys(days).sort();
    const { requiredDates, totalWorkingDays, totalWorkingDaysRegular } =
      getTheRequiredDaysPerWeek(schedule, filter);
    const requiredDaysPerWeek = groupDatesPerWeek(requiredDates);

    const weeks: { [week: string]: string[] } = groupDatesPerWeek(dateKeys);

    const missingDaysCount = Object.keys(requiredDaysPerWeek).reduce(
      (acc: number, week: string) => {
        const required = requiredDaysPerWeek[week] || [];
        const actual = weeks[week] || [];
        const missing = required.filter((day) => !actual.includes(day));
        return acc + missing.length;
      },
      0
    );

    const scheduledDays = (schedule.daysIncluded || [])
      .filter((d: any) => d.included)
      .map((d: any) => d.value)
      .sort((a: number, b: number) => b - a);

    const totalScheduledDays = scheduledDays.length;

    let totalDays = 0;

    if (totalScheduledDays <= 2) {
      //const workingDaysDeduction = missingDaysCount * (5 / scheduledDays.length);
      const workingDaysDeduction = missingDaysCount * 2.5;
      totalDays = totalWorkingDaysRegular - workingDaysDeduction;

      Object.keys(weeks).map((week: string) => {
        const actualDays = weeks[week].map((item) => new Date(item).getDay());

        actualDays.forEach((actualDay) => {
          let nearestScheduledDay = 0;

          for (let i = 0; i < scheduledDays.length; i++) {
            const item = scheduledDays[i];
            if (actualDay >= item) {
              nearestScheduledDay = item;
              break;
            }
          }

          let diff = actualDay - nearestScheduledDay;
          diff = diff < 0 ? 0 : diff;
          totalDays -= diff;
        });
      });
    } else {
      const totalActualDays = Object.keys(weeks)
        .map((week: string) => {
          const actualDays = weeks[week].map((item) => new Date(item).getDay());

          return actualDays;
        })
        .flat().length;

      totalDays = totalActualDays;
    }

    let earnings = 0;
    let deductions = 0;
    let net = 0;

    if (employee && employee.type === "MONTHLY") {
      const from = new Date(filter.from);
      const to = new Date(filter.to);
      const daysInRange =
        (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1;

      const daysInMonth = new Date(
        from.getFullYear(),
        from.getMonth() + 1,
        0
      ).getDate();
      const rate = typeof employee.rate === "number" ? employee.rate : 0;

      earnings = rate * (daysInRange / daysInMonth);
    } else {
      earnings =
        employee && typeof employee.rate === "number"
          ? totalDays * employee.rate
          : 0;
    }

    deductions = employee ? getTotalDeduction(employee) : 0;
    net = earnings - deductions;
    net = net < 0 ? 0 : net;

    if (totalDays < 0) totalDays = 0;

    return {
      totalDays:
        totalDays % 1 === 0 ? totalDays.toFixed(0) : totalDays.toFixed(2),
      late: "0",
      earnings: earnings % 1 === 0 ? earnings.toFixed(0) : earnings.toFixed(2),
      deductions:
        deductions % 1 === 0 ? deductions.toFixed(0) : deductions.toFixed(2),
      net: net % 1 === 0 ? net.toFixed(0) : net.toFixed(2),
    };
  }
};

export const computeTotalDaysAndLateSingle = ({
  reports,
  employee,
  settings,
  businessDays = 10,
  ref,
  filter = false,
  dates,
}: {
  reports: any;
  employee: any;
  settings: any;
  businessDays?: number;
  ref?: any;
  filter?: boolean;
  dates: { from: Date; to: Date };
}) => {
  const gracePeriod = settings.gracePeriod || 10;
  let schedule: Schedule = employee?.schedule || REGULAR_SCHEDULE;
  if (typeof schedule.daysIncluded === "string") {
    try {
      schedule = {
        ...schedule,
        daysIncluded: JSON.parse(schedule.daysIncluded),
      };
    } catch (e) {
      schedule = { ...schedule, daysIncluded: [] };
    }
  }

  if (filter && schedule.option !== "Straight Time") {
    Object.keys(reports).forEach((date) => {
      const dayOfWeek = new Date(date).getDay();

      if (!schedule.daysIncluded.map((d) => d.value).includes(dayOfWeek)) {
        delete reports[date];
      }
    });
  }

  if (schedule.option === "Straight Time") {
    const { requiredDates, totalWorkingDays, totalWorkingDaysRegular } =
      getTheRequiredDaysPerWeek(schedule, dates);

    const actualDates = Object.keys(reports);
    const requiredDatesSet = new Set(requiredDates);

    if (actualDates.length > requiredDates.length) {
      for (const date of actualDates) {
        if (!requiredDatesSet.has(date)) {
          delete reports[date];
        }
      }
    }

    const scheduledDays = (schedule.daysIncluded || [])
      .filter((d: any) => d.included)
      .map((d: any) => d.value)
      .sort((a: number, b: number) => b - a);

    //const perDayEquivalent = 5 / scheduledDays.length;
    const perDayEquivalent = 1;
    const perAbsence = 2.5;

    const straightTimeReports = Object.keys(reports)
      .sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime())
      .map((date, index: number) => {
        const times = reports[date].sort(
          (a: Date, b: Date) => new Date(a).getTime() - new Date(b).getTime()
        );

        let filterTimes = times;
        if (times.length > 4) {
          filterTimes = [times[0], times[1], times[2], times[times.length - 1]];
        }

        const items = filterTimes
          .slice(0, 4)
          .reduce((acc: any, time: any, index: number) => {
            acc[`r${index + 1}`] = time;
            return acc;
          }, {});

        let totalDays = perDayEquivalent;
        const dayOfWeek = new Date(date).getDay();

        let nearestScheduledDay = 0;

        for (let i = 0; i < scheduledDays.length; i++) {
          const item = scheduledDays[i];
          if (dayOfWeek >= item) {
            nearestScheduledDay = item;
            break;
          }
        }

        let diff = dayOfWeek - nearestScheduledDay;
        diff = diff < 0 ? 0 : diff;
        totalDays -= diff;

        let earnings = 0;
        earnings = employee ? totalDays * employee.rate : 0;

        const deductions = 0;
        let net = earnings - deductions;
        net = net < 0 ? 0 : net;

        return {
          date,
          ...items,
          name: ref,
          remarks: "-",
          totalDays,
          minsLate: 0,
          totalHours: "Straight Time",
          earnings:
            earnings % 1 === 0 ? earnings.toFixed(0) : earnings.toFixed(2),
          deductions:
            deductions % 1 === 0
              ? deductions.toFixed(0)
              : deductions.toFixed(2),
          net: net % 1 === 0 ? net.toFixed(0) : net.toFixed(2),
        };
      });

    const total = straightTimeReports.reduce(
      (sum: number, num: any) => sum + num.totalDays,
      0
    );

    const totalDays =
      totalWorkingDaysRegular - (requiredDates.length - total) * perAbsence;

    return {
      items: straightTimeReports.sort((a: any, b: any) =>
        a.date.localeCompare(b.date)
      ),
      totalDays:
        totalDays % 1 === 0 ? totalDays.toFixed(0) : totalDays.toFixed(2),
      totalMinsLate: "0",
    };
  }

  const sortedReports = Object.keys(reports)
    .sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime())
    .map((date, index: number) => {
      const times = reports[date].sort(
        (a: Date, b: Date) => new Date(a).getTime() - new Date(b).getTime()
      );

      const dayOfWeek = new Date(date).getDay();

      const daySchedule = schedule.daysIncluded.find(
        (d: any) => d.value === dayOfWeek
      );

      let filterTimes = times;
      if (times.length > 4) {
        filterTimes = [times[0], times[1], times[2], times[times.length - 1]];
      }

      const items = filterTimes
        .slice(0, 4)
        .reduce((acc: any, time: any, index: number) => {
          acc[`r${index + 1}`] = time;
          return acc;
        }, {});

      let remarks = "";

      if (!daySchedule) {
        remarks = "UNSCHED";

        return {
          date,
          ...items,
          name: ref,
          earnings: 0,
          deductions: 0,
          net: 0,
          remarks,
          totalDays: 0,
          totalHours: 0,
          minsLate: 0,
        };
      }

      const inTimeStr = daySchedule?.inTime;
      const outTimeStr = daySchedule?.outTime;

      const inTime = new Date(date + "T" + inTimeStr?.split("T")[1]);
      const outTime = new Date(date + "T" + outTimeStr?.split("T")[1]);
      const halfDay =
        inTime.getTime() +
        (outTime.getTime() - inTime.getTime()) / 2 -
        30 * 60 * 1000;

      const workingHours =
        (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60) - 1;

      const totalHours =
        (times[times.length - 1].getTime() - times[0].getTime()) /
        (1000 * 60 * 60);

      const cutoff = inTime ? new Date(inTime) : undefined;
      if (cutoff) cutoff.setMinutes(cutoff.getMinutes() + gracePeriod);

      let lateness =
        cutoff && times[0] ? times[0].getTime() - cutoff.getTime() : 0;

      let totalDays = Math.min(
        1,
        Math.floor(totalHours / workingHours) +
          (totalHours % workingHours) / workingHours
      );

      if (times[0].getTime() >= halfDay || totalHours <= 0.5) {
        remarks = "HALF DAY";
        lateness = 0;
        totalDays = 0.5;
      }

      let totalLate = lateness > 0 ? Math.floor(lateness / (1000 * 60)) : 0;
      let deductions = (totalLate / 480) * 300;

      let overtime = 0;
      let undertime = 0;
      if (inTime && outTime && times.length > 1) {
        const actualHours =
          (times[times.length - 1].getTime() - times[0].getTime()) /
          (1000 * 60 * 60);
        if (actualHours > totalHours) {
          overtime = actualHours - totalHours;
        } else if (actualHours < totalHours) {
          undertime = totalHours - actualHours;
        }
      }

      if (!remarks) {
        if (totalLate > 0) remarks = "LATE";
        // if (overtime > 1)
        //   remarks = remarks ? remarks + ", OVERTIME" : "OVERTIME";
        if (undertime > 0)
          remarks = remarks ? remarks + ", UNDERTIME" : "UNDERTIME";
        if (!remarks) remarks = "-";
      }

      let earnings = 0;

      if (employee.type === "MONTHLY") {
        earnings = employee.rate / 2;
        const from = new Date(dates.from);
        const to = new Date(dates.to);
        const daysInRange =
          (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1;

        const daysInMonth = new Date(
          from.getFullYear(),
          from.getMonth() + 1,
          0
        ).getDate();
        const rate = typeof employee.rate === "number" ? employee.rate : 0;

        earnings = rate * (daysInRange / daysInMonth);
      } else {
        earnings = employee ? totalDays * employee.rate : 0;
      }

      let net = employee ? earnings - deductions : 0;
      net = net < 0 ? 0 : net;

      return {
        date,
        ...items,
        name: ref,
        earnings:
          earnings % 1 === 0 ? earnings.toFixed(0) : earnings.toFixed(2),
        deductions:
          deductions % 1 === 0 ? deductions.toFixed(0) : deductions.toFixed(2),
        net: net % 1 === 0 ? net.toFixed(0) : net.toFixed(2),
        remarks,
        totalDays,
        totalHours:
          totalHours % 1 === 0 || totalHours < 1
            ? totalHours.toFixed(0)
            : totalHours.toFixed(2),
        minsLate: totalLate,
      };
    });

  const total = sortedReports.reduce(
    (sum: number, num: any) => sum + num.totalDays,
    0
  );

  const totalMinsLate = sortedReports.reduce(
    (sum: number, num: any) => sum + num.minsLate,
    0
  );

  return {
    items: sortedReports.sort((a: any, b: any) => a.date.localeCompare(b.date)),
    totalDays: total % 1 === 0 ? total.toFixed(0) : total.toFixed(2),
    totalMinsLate:
      totalMinsLate % 1 === 0
        ? totalMinsLate.toFixed(0)
        : totalMinsLate.toFixed(2),
  };
};

const getTotalDeduction = (employee: any) => {
  const deductionList = [
    "gsisgs",
    "ec",
    "gsisps",
    "phic",
    "hdmfgs",
    "hdmfps",
    "wtax",
    "sss",
    "mplhdmf",
    "gfal",
    "landbank",
    "cb",
    "eml",
    "mplgsis",
    "tagum",
    "ucpb",
    "mpllite",
    "sb",
  ];

  return deductionList.reduce((sum: number, deduction: string) => {
    return sum + (employee[deduction] || 0);
  }, 0);
};

const timeStringToDate = (timeString: string): Date => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const getTotalBusinessDays = (from: Date, to: Date, events: any[]) => {
  from = new Date(from);
  to = new Date(to);

  return getBusinessDays(from, to) - getTotalHolidays(events);
};

const regularComputation = (
  date: string,
  schedule: Schedule,
  times: Date[],
  gracePeriod: number
) => {
  const dayOfWeek = new Date(date).getDay();
  const daySchedule = schedule.daysIncluded.find(
    (d: any) => d.value === dayOfWeek
  );

  if (!daySchedule) return;

  const inTimeStr = daySchedule.inTime;
  const outTimeStr = daySchedule.outTime;

  const inTime = new Date(date + "T" + inTimeStr.split("T")[1]);
  const outTime = new Date(date + "T" + outTimeStr.split("T")[1]);
  const halfDay =
    inTime.getTime() +
    (outTime.getTime() - inTime.getTime()) / 2 -
    30 * 60 * 1000;

  const workingHours =
    (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60) - 1;

  const totalHours =
    (times[times.length - 1].getTime() - times[0].getTime()) / (1000 * 60 * 60);

  if (times.length < 2 || totalHours <= 0.5) {
    return {
      totalDays: 0.5,
      late: 0,
      deductions: 0,
    };
  }

  const cutoff = inTime;
  cutoff.setMinutes(cutoff.getMinutes() + gracePeriod);

  let lateness = times[0].getTime() - cutoff.getTime();

  if (times[0].getTime() >= halfDay) lateness = 0;

  const totalDays = Math.min(
    1,
    Math.floor(totalHours / workingHours) +
      (totalHours % workingHours) / workingHours
  );
  const totalLate = lateness > 0 ? Math.floor(lateness / (1000 * 60)) : 0;
  let deductions = (totalLate / 480) * 300;

  return {
    totalDays,
    late: totalLate < 0 ? 0 : totalLate,
    deductions,
  };
};

const getTheRequiredDaysPerWeek = (
  schedule: Schedule,
  filter: { from: Date; to: Date }
) => {
  const { from, to } = filter;
  const requiredDates: string[] = [];
  let totalWorkingDays = 0;
  let totalWorkingDaysRegular = 0;

  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const daySchedule = schedule.daysIncluded.find(
      (day: any) => day.value === dayOfWeek
    );

    if (daySchedule && daySchedule.included) {
      requiredDates.push(format(new Date(d), "yyyy-MM-dd"));
      totalWorkingDays++;
    }

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      totalWorkingDaysRegular++;
    }
  }

  return { requiredDates, totalWorkingDays, totalWorkingDaysRegular };
};

const groupDatesPerWeek = (dateKeys: string[]) => {
  const weeks: { [week: string]: string[] } = {};
  dateKeys.forEach((dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const jan4 = new Date(year, 0, 4);
    const jan4Day = jan4.getDay() || 7;
    const weekStart = new Date(jan4);
    weekStart.setDate(jan4.getDate() - jan4Day + 1);
    const diff = Math.floor(
      (date.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    const weekNum = diff + 1;
    const weekKey = `${year}-W${weekNum.toString().padStart(2, "0")}`;
    if (!weeks[weekKey]) weeks[weekKey] = [];

    if (!weeks[weekKey].includes(dateStr)) {
      weeks[weekKey].push(dateStr);
    }
  });

  return weeks;
};
