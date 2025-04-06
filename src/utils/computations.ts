import { format } from "date-fns";

export const computeTotalDaysAndLate = (dates: any[], employee?: any) => {
  const days = dates
    .map((item: any) => item.timestamp)
    .reduce((acc: any, dateTime: any) => {
      const date = format(
        new Date(dateTime.$date),
        "yyyy-MM-dd HH:mm:ss"
      ).split(" ")[0];
      acc[date] = acc[date] || [];
      acc[date].push(new Date(dateTime.$date));
      return acc;
    }, {});

  const inOut = Object.keys(days).map((date) => {
    const times = days[date].sort(
      (a: Date, b: Date) => a.getTime() - b.getTime()
    );

    const totalHours =
      (times[times.length - 1].getTime() - times[0].getTime()) /
      (1000 * 60 * 60);

    const cutoff = new Date(times[0]);
    cutoff.setHours(8, 10, 0, 0);
    const lateness = times[0].getTime() - cutoff.getTime();
    const totalDays = Math.min(
      1,
      Math.floor(totalHours / 8) + (totalHours % 8) / 8
    );
    const totalLate = lateness > 0 ? Math.floor(lateness / (1000 * 60)) : 0;
    const deductions = (totalLate / 480) * 300;

    return {
      totalDays,
      late: totalLate,
      deductions,
    };
  }) as any;

  const total = inOut.reduce((sum: number, num: any) => sum + num.totalDays, 0);
  const late = inOut.reduce((sum: number, num: any) => sum + num.late, 0);
  const lateDeductions = inOut.reduce(
    (sum: number, num: any) => sum + num.deductions,
    0
  );

  //temporary calculations
  let earnings = 0;

  if (employee.type === "MONTHLY") {
    const dailyRate = (employee.rate * 12) / 261;
    earnings = total * dailyRate;
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
};

export const computeTotalDaysAndLateSingle = (reports: any, employee: any) => {
  return Object.keys(reports)
    .sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime())
    .map((date) => {
      const times = reports[date].sort(
        (a: Date, b: Date) => a.getTime() - b.getTime()
      );

      const totalHours =
        (times[times.length - 1].getTime() - times[0].getTime()) /
          (1000 * 60 * 60) -
        1;

      const cutoff = new Date(times[0]);
      cutoff.setHours(8, 10, 0, 0);
      const lateness = times[0].getTime() - cutoff.getTime();
      const totalDays = Math.min(
        1,
        Math.floor(totalHours / 8) + (totalHours % 8) / 8
      );
      const totalLate = lateness > 0 ? Math.floor(lateness / (1000 * 60)) : 0;

      console.log(totalHours);

      const deductions = (totalLate / 480) * 300;

      //temporary calculations
      let earnings = 0;
      if (employee.type === "MONTHLY") {
        const dailyRate = (employee.rate * 12) / 261;
        earnings = totalDays * dailyRate;
      } else {
        earnings = employee ? totalDays * employee.rate : 0;
      }

      const net = employee ? earnings - deductions : 0;

      return {
        date,
        name: employee.name,
        earnings:
          earnings % 1 === 0 ? earnings.toFixed(0) : earnings.toFixed(1),
        deductions:
          deductions % 1 === 0 ? deductions.toFixed(0) : deductions.toFixed(1),
        net: net % 1 === 0 ? net.toFixed(0) : net.toFixed(1),
      };
    });
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
