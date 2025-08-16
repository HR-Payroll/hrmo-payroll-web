import { format } from "date-fns";
import { getBusinessDays, getTotalHolidays } from "./holidays";
import { REGULAR_SCHEDULE } from "@/data/constants";
import { dateTz } from "./dateFormatter";
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
  employee?: any;
  businessDays?: number;
  filter: { from: Date; to: Date };
}) => {
  const days = dates
    .map((item: any) => item.timestamp)
    .reduce((acc: any, dateTime: any) => {
      const date = format(
        dateTz(new Date(dateTime)),
        "yyyy-MM-dd HH:mm:ss"
      ).split(" ")[0];
      acc[date] = acc[date] || [];
      acc[date].push(dateTz(new Date(dateTime)));
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
    const dayOfWeek = dateTz(new Date(date)).getDay();

    if (!schedule.daysIncluded.map((d) => d.value).includes(dayOfWeek)) {
      delete days[date];
    }
  });

  let inOut: any[] = [];

  if (schedule.option !== "Straight Time") {
    inOut = Object.keys(days).map((date) => {
      const times = days[date].sort(
        (a: Date, b: Date) => dateTz(a).getTime() - dateTz(b).getTime()
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

    if (employee.type === "MONTHLY") {
      earnings = Math.min(
        (employee.rate / 2 / businessDays) * total,
        employee.rate / 2
      );
    } else {
      earnings = employee ? total * employee.rate : 0;
    }

    const deductions = employee
      ? getTotalDeduction(employee) + lateDeductions
      : 0;
    const net = earnings - deductions;

    return {
      totalDays: total % 1 === 0 ? total.toFixed(0) : total.toFixed(1),
      late: late % 1 === 0 ? late.toFixed(0) : late.toFixed(1),
      earnings: earnings % 1 === 0 ? earnings.toFixed(0) : earnings.toFixed(1),
      deductions:
        deductions % 1 === 0 ? deductions.toFixed(0) : deductions.toFixed(1),
      net: net % 1 === 0 ? net.toFixed(0) : net.toFixed(1),
    };
  } else {
    const dateKeys = Object.keys(days).sort();
    // if (dateKeys.length < 2) {
    //   return {
    //     totalDays: 0,
    //     late: 0,
    //     earnings: 0,
    //     deductions: 0,
    //     net: 0,
    //   };
    // }
    const { requiredDates, totalWorkingDays } = getTheRequiredDaysPerWeek(
      schedule,
      filter
    );
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

    const workingDaysDeduction = missingDaysCount * (5 / scheduledDays.length);
    let totalDays = totalWorkingDays - workingDaysDeduction;

    Object.keys(weeks).map((week: string) => {
      const actualDays = weeks[week].map((item) =>
        dateTz(new Date(item)).getDay()
      );

      actualDays.forEach((actualDay) => {
        let nearestScheduledDay = 0;

        for (let i = 0; i < scheduledDays.length; i++) {
          const item = scheduledDays[i];
          console.log("Scheduled Day:", item);
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

    let earnings = 0;
    earnings = employee ? totalDays * employee.rate : 0;

    const deductions = employee ? getTotalDeduction(employee) : 0;
    let net = earnings - deductions;
    net = net < 0 ? 0 : net;

    return {
      totalDays:
        totalDays % 1 === 0 ? totalDays.toFixed(0) : totalDays.toFixed(1),
      late: 0,
      earnings: earnings % 1 === 0 ? earnings.toFixed(0) : earnings.toFixed(1),
      deductions:
        deductions % 1 === 0 ? deductions.toFixed(0) : deductions.toFixed(1),
      net: net % 1 === 0 ? net.toFixed(0) : net.toFixed(1),
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
      const dayOfWeek = dateTz(new Date(date)).getDay();

      if (!schedule.daysIncluded.map((d) => d.value).includes(dayOfWeek)) {
        delete reports[date];
      }
    });
  }

  if (schedule.option === "Straight Time") {
    const { requiredDates, totalWorkingDays } = getTheRequiredDaysPerWeek(
      schedule,
      dates
    );

    const actualDates = Object.keys(reports);
    const requiredDatesSet = new Set(requiredDates);

    if (actualDates.length > requiredDates.length) {
      // Filter out extra dates not in requiredDates
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

    const perDayEquivalent = 5 / scheduledDays.length;

    const straightTimeReports = Object.keys(reports)
      .sort(
        (a: any, b: any) =>
          dateTz(new Date(b)).getTime() - dateTz(new Date(a)).getTime()
      )
      .map((date, index: number) => {
        const times = reports[date].sort(
          (a: Date, b: Date) => dateTz(a).getTime() - dateTz(b).getTime()
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
        const dayOfWeek = dateTz(new Date(date)).getDay();

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

        console.log("Nearest Scheduled Day:", nearestScheduledDay);
        console.log("Total Days:", totalDays);

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
            earnings % 1 === 0 ? earnings.toFixed(0) : earnings.toFixed(1),
          deductions:
            deductions % 1 === 0
              ? deductions.toFixed(0)
              : deductions.toFixed(1),
          net: net % 1 === 0 ? net.toFixed(0) : net.toFixed(1),
        };
      });

    const total = straightTimeReports.reduce(
      (sum: number, num: any) => sum + num.totalDays,
      0
    );

    return {
      items: straightTimeReports,
      totalDays: total % 1 === 0 ? total.toFixed(0) : total.toFixed(1),
      totalMinsLate: 0,
    };
  }

  const sortedReports = Object.keys(reports)
    .sort(
      (a: any, b: any) =>
        dateTz(new Date(b)).getTime() - dateTz(new Date(a)).getTime()
    )
    .map((date, index: number) => {
      const times = reports[date].sort(
        (a: Date, b: Date) => dateTz(a).getTime() - dateTz(b).getTime()
      );

      const dayOfWeek = dateTz(new Date(date)).getDay();

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

      if (times.length < 2) {
        remarks = "INC";

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

      const inTime = dateTz(new Date(date + "T" + inTimeStr?.split("T")[1]));
      const outTime = dateTz(new Date(date + "T" + outTimeStr?.split("T")[1]));

      const workingHours =
        (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60) - 1;

      const totalHours =
        (times[times.length - 1].getTime() - times[0].getTime()) /
        (1000 * 60 * 60);

      const cutoff = inTime ? dateTz(new Date(inTime)) : undefined;
      if (cutoff) cutoff.setMinutes(cutoff.getMinutes() + gracePeriod);

      const lateness =
        cutoff && times[0] ? times[0].getTime() - cutoff.getTime() : 0;

      const totalDays = Math.min(
        1,
        Math.floor(totalHours / workingHours) +
          (totalHours % workingHours) / workingHours
      );

      let totalLate = lateness > 0 ? Math.floor(lateness / (1000 * 60)) : 0;
      totalLate;

      let deductions = (totalLate / 480) * 300;
      console.log("Deductions:", deductions);

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

      //temporary calculations
      let earnings = 0;
      if (employee.type === "MONTHLY") {
        earnings = (employee.rate / 2 / businessDays) * totalDays;
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
          earnings % 1 === 0 ? earnings.toFixed(0) : earnings.toFixed(1),
        deductions:
          deductions % 1 === 0 ? deductions.toFixed(0) : deductions.toFixed(1),
        net: net % 1 === 0 ? net.toFixed(0) : net.toFixed(1),
        remarks,
        totalDays,
        totalHours:
          totalHours % 1 === 0 ? totalHours.toFixed(0) : totalHours.toFixed(1),
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
    totalDays: total % 1 === 0 ? total.toFixed(0) : total.toFixed(1),
    totalMinsLate:
      totalMinsLate % 1 === 0
        ? totalMinsLate.toFixed(0)
        : totalMinsLate.toFixed(1),
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
    return sum + employee[deduction] || 0;
  }, 0);
};

const timeStringToDate = (timeString: string): Date => {
  console.log("Time String:", timeString);
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const getTotalBusinessDays = (from: Date, to: Date, events: any[]) => {
  from = dateTz(new Date(from));
  to = dateTz(new Date(to));

  return getBusinessDays(from, to) - getTotalHolidays(events);
};

const regularComputation = (
  date: string,
  schedule: Schedule,
  times: Date[],
  gracePeriod: number
) => {
  const dayOfWeek = dateTz(new Date(date)).getDay();
  const daySchedule = schedule.daysIncluded.find(
    (d: any) => d.value === dayOfWeek
  );

  if (!daySchedule) return;

  const inTimeStr = daySchedule.inTime;
  const outTimeStr = daySchedule.outTime;

  const inTime = dateTz(new Date(date + "T" + inTimeStr.split("T")[1]));
  const outTime = dateTz(new Date(date + "T" + outTimeStr.split("T")[1]));

  if (times.length < 2) {
    return {
      totalDays: 0,
      late: 0,
      deductions: 0,
    };
  }

  const workingHours =
    (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60) - 1;

  const totalHours =
    (times[times.length - 1].getTime() - times[0].getTime()) / (1000 * 60 * 60);

  const cutoff = inTime;
  cutoff.setMinutes(cutoff.getMinutes() + gracePeriod);

  const lateness = times[0].getTime() - cutoff.getTime();
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

  for (let d = dateTz(new Date(from)); d < to; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const daySchedule = schedule.daysIncluded.find(
      (day: any) => day.value === dayOfWeek
    );

    if (daySchedule && daySchedule.included) {
      requiredDates.push(format(dateTz(new Date(d)), "yyyy-MM-dd"));
    }

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      totalWorkingDays++;
    }
  }

  return { requiredDates, totalWorkingDays };
};

const groupDatesPerWeek = (dateKeys: string[]) => {
  const weeks: { [week: string]: string[] } = {};
  dateKeys.forEach((dateStr) => {
    const date = dateTz(new Date(dateStr));
    const year = date.getFullYear();
    const jan4 = dateTz(new Date(year, 0, 4));
    const jan4Day = jan4.getDay() || 7;
    const weekStart = dateTz(new Date(jan4));
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
