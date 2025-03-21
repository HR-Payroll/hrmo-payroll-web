import { format } from "date-fns";

export const computeTotalDaysAndLate = (dates: any[]) => {
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

    return {
      totalDays: Math.min(1, Math.floor(totalHours / 8) + (totalHours % 8) / 8),
      late: lateness > 0 ? Math.floor(lateness / (1000 * 60)) : 0,
    };
  }) as any;

  const total = inOut.reduce((sum: number, num: any) => sum + num.totalDays, 0);
  const late = inOut.reduce((sum: number, num: any) => sum + num.late, 0);

  return {
    totalDays: total % 1 === 0 ? total.toFixed(0) : total.toFixed(1),
    late: late % 1 === 0 ? late.toFixed(0) : late.toFixed(1),
  };
};
