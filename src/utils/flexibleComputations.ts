import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { REGULAR_SCHEDULE } from "@/data/constants";
import { Schedule } from "@/types";
import { utcToPH } from "@/utils/dateFormatter";

type DateRange = { from: Date; to: Date };

type ShiftRule = {
  start: string;
  end: string;
  breakMinutes?: number;
  graceMinutes?: number;
};

type DayRule = {
  included: boolean;
  shifts: ShiftRule[];
};

type NormalizedSchedule = {
  option?: string;
  weekdays: Record<number, DayRule>;
};

const getSingleShiftForDateKey = (
  schedule: NormalizedSchedule,
  dateKey: string,
): ShiftRule | null => {
  const dayOfWeek = utcToPH(new Date(dateKey + "T00:00:00")).getDay();
  const rule = schedule.weekdays[dayOfWeek];
  if (!rule?.included) return null;
  const shift = rule.shifts?.[0];
  if (!shift?.start || !shift?.end) return null;
  return shift;
};

type DayAttendanceResult = {
  dateKey: string;
  dayEquivalent: number;
  lateMinutes: number;
  deductions: number;
  remarks: string;
};

type DayEvalResult = {
  dayEquivalent: number;
  lateMinutes: number;
  remarks: string;
};

const minutesFromHHmm = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map((v) => Number(v));
  return h * 60 + (m || 0);
};

const dateKeyInManila = (timestamp: Date | string): string => {
  const dt = toZonedTime(new Date(timestamp), "Asia/Manila");
  return format(dt, "yyyy-MM-dd");
};

const enumerateDateKeys = (range: DateRange): string[] => {
  const from = new Date(range.from);
  const to = new Date(range.to);
  const keys: string[] = [];

  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    keys.push(format(new Date(d), "yyyy-MM-dd"));
  }

  return keys;
};

const prefillDateKeys = (
  existing: Record<string, Date[]>,
  range: DateRange,
): Record<string, Date[]> => {
  const filled: Record<string, Date[]> = { ...existing };
  for (const key of enumerateDateKeys(range)) {
    if (!filled[key]) filled[key] = [];
  }
  return filled;
};

const groupTimestampsByDateKey = (
  timestamps: Array<Date | string>,
): Record<string, Date[]> => {
  return timestamps.reduce((acc: Record<string, Date[]>, ts) => {
    const key = dateKeyInManila(ts);
    (acc[key] ??= []).push(new Date(ts));
    return acc;
  }, {});
};

const parseDaysIncluded = (schedule: Schedule): any[] => {
  const raw = (schedule as any)?.daysIncluded;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const normalizeSchedule = (employee: any): NormalizedSchedule => {
  const base: Schedule = employee?.schedule || (REGULAR_SCHEDULE as any);
  const daysIncluded = parseDaysIncluded(base);

  const weekdays: Record<number, DayRule> = {
    0: { included: false, shifts: [] },
    1: { included: false, shifts: [] },
    2: { included: false, shifts: [] },
    3: { included: false, shifts: [] },
    4: { included: false, shifts: [] },
    5: { included: false, shifts: [] },
    6: { included: false, shifts: [] },
  };

  for (const day of daysIncluded) {
    const value = Number(day?.value);
    if (Number.isNaN(value) || value < 0 || value > 6) continue;

    const included = !!day?.included;

    const shifts: ShiftRule[] = [];

    // single-shift only for now: derive from inTime/outTime (same as original computations)
    if (day?.inTime && day?.outTime) {
      const start = utcToPH(new Date(day.inTime))
        .toISOString()
        .split("T")[1]
        ?.slice(0, 5);
      const end = utcToPH(new Date(day.outTime))
        .toISOString()
        .split("T")[1]
        ?.slice(0, 5);

      if (start && end) {
        shifts.push({ start, end });
      }
    }

    weekdays[value] = { included, shifts };
  }

  return {
    option: (base as any)?.option,
    weekdays,
  };
};

const isScheduledDay = (schedule: NormalizedSchedule, dateKey: string) => {
  const dayOfWeek = utcToPH(new Date(dateKey + "T00:00:00")).getDay();
  const rule = schedule.weekdays[dayOfWeek];
  return !!rule?.included;
};

const evaluateDayLikeOriginal = (args: {
  dateKey: string;
  shift: ShiftRule;
  timestamps: Date[];
  graceMinutes: number;
}): DayEvalResult => {
  const { dateKey, shift, timestamps, graceMinutes } = args;

  const sorted = [...(timestamps || [])]
    .map((t) => utcToPH(new Date(t)))
    .sort((a, b) => a.getTime() - b.getTime());

  if (sorted.length === 0) {
    return { dayEquivalent: 0, lateMinutes: 0, remarks: "-" };
  }

  const startMins = minutesFromHHmm(shift.start);
  const endMins = minutesFromHHmm(shift.end);
  const dayStart = utcToPH(new Date(dateKey + "T00:00:00"));

  const inTime = new Date(dayStart);
  inTime.setMinutes(startMins);
  const outTime = new Date(dayStart);
  outTime.setMinutes(endMins);

  const halfDayPoint =
    inTime.getTime() +
    (outTime.getTime() - inTime.getTime()) / 2 -
    30 * 60 * 1000;

  const workingHours =
    (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60) - 1;

  if (sorted.length < 2) {
    return { dayEquivalent: 0.5, lateMinutes: 0, remarks: "HALF DAY" };
  }

  const totalHours =
    (sorted[sorted.length - 1].getTime() - sorted[0].getTime()) /
    (1000 * 60 * 60);

  if (totalHours <= 0.5 || workingHours <= 0) {
    return { dayEquivalent: 0.5, lateMinutes: 0, remarks: "HALF DAY" };
  }

  const cutoff = new Date(inTime);
  cutoff.setMinutes(cutoff.getMinutes() + graceMinutes);

  let latenessMs = sorted[0].getTime() - cutoff.getTime();
  if (sorted[0].getTime() >= halfDayPoint) {
    return { dayEquivalent: 0.5, lateMinutes: 0, remarks: "HALF DAY" };
  }

  const lateMinutes = latenessMs > 0 ? Math.floor(latenessMs / (1000 * 60)) : 0;

  const dayEquivalent = Math.min(
    1,
    Math.floor(totalHours / workingHours) +
      (totalHours % workingHours) / workingHours,
  );

  return {
    dayEquivalent,
    lateMinutes,
    remarks: lateMinutes > 0 ? "LATE" : "-",
  };
};

const computeLateDeductions = (lateMinutes: number) => {
  // keep existing behavior: (late/480) * 300
  return (lateMinutes / 480) * 300;
};

const computeEarningsForRange = (args: {
  employee: any;
  range: DateRange;
  totalDaysEquivalent: number;
}): number => {
  const { employee, range, totalDaysEquivalent } = args;

  if (!employee) return 0;

  const rate = typeof employee.rate === "number" ? employee.rate : 0;
  if (!rate) return 0;

  if (employee.type === "MONTHLY") {
    const from = new Date(range.from);
    const to = new Date(range.to);
    const daysInRange =
      (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24) + 1;
    const daysInMonth = new Date(
      from.getFullYear(),
      from.getMonth() + 1,
      0,
    ).getDate();

    return rate * (daysInRange / daysInMonth);
  }

  return totalDaysEquivalent * rate;
};

export const computeTotalDaysAndLateFlexible = (args: {
  dates: any[];
  settings: any;
  employee?: any;
  filter: DateRange;
}) => {
  const { dates, settings, employee, filter } = args;
  const graceMinutes = settings?.gracePeriod || 10;

  const timestamps = (dates || []).map((d: any) => d.timestamp);
  const grouped = prefillDateKeys(groupTimestampsByDateKey(timestamps), filter);

  const schedule = normalizeSchedule(employee);

  const dayKeys = Object.keys(grouped).sort();

  const results: DayAttendanceResult[] = [];

  for (const dateKey of dayKeys) {
    const shift = getSingleShiftForDateKey(schedule, dateKey);
    if (!shift) continue;

    const res = evaluateDayLikeOriginal({
      dateKey,
      shift,
      timestamps: grouped[dateKey] || [],
      graceMinutes,
    });

    const deductions = computeLateDeductions(res.lateMinutes);

    results.push({
      dateKey,
      dayEquivalent: res.dayEquivalent,
      lateMinutes: res.lateMinutes,
      deductions,
      remarks: res.dayEquivalent === 0 ? "-" : res.remarks,
    });
  }

  const totalDaysEquivalent = results.reduce(
    (sum, r) => sum + r.dayEquivalent,
    0,
  );
  const totalLateMinutes = results.reduce((sum, r) => sum + r.lateMinutes, 0);
  const totalLateDeductions = results.reduce((sum, r) => sum + r.deductions, 0);

  const earnings = computeEarningsForRange({
    employee,
    range: filter,
    totalDaysEquivalent,
  });

  const deductions = totalLateDeductions;
  const net = earnings - deductions;

  return {
    totalDays:
      totalDaysEquivalent % 1 === 0
        ? totalDaysEquivalent.toFixed(0)
        : totalDaysEquivalent.toFixed(2),
    late:
      totalLateMinutes % 1 === 0
        ? totalLateMinutes.toFixed(0)
        : totalLateMinutes.toFixed(1),
    earnings: earnings % 1 === 0 ? earnings.toFixed(0) : earnings.toFixed(2),
    deductions:
      deductions % 1 === 0 ? deductions.toFixed(0) : deductions.toFixed(2),
    net: net % 1 === 0 ? net.toFixed(0) : net.toFixed(2),
  };
};

export const computeTotalDaysAndLateSingleFlexible = (args: {
  reports: Record<string, Date[]>;
  employee: any;
  settings: any;
  ref?: any;
  dates: DateRange;
  filter?: boolean;
}) => {
  const { employee, settings, ref, dates } = args;
  const graceMinutes = settings?.gracePeriod || 10;

  // never mutate incoming reports
  const grouped = prefillDateKeys({ ...(args.reports || {}) }, dates);

  const schedule = normalizeSchedule(employee);

  const dayKeys = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  const items = dayKeys
    .filter((dateKey) => {
      if (!args.filter) return true;
      return isScheduledDay(schedule, dateKey);
    })
    .map((dateKey) => {
      const dayOfWeek = new Date(dateKey + "T00:00:00").getDay();
      const dayRule = schedule.weekdays[dayOfWeek];
      const shifts = dayRule?.shifts ?? [];

      const shift = shifts?.[0];
      const res = shift
        ? evaluateDayLikeOriginal({
            dateKey,
            shift,
            timestamps: grouped[dateKey] || [],
            graceMinutes,
          })
        : ({
            dayEquivalent: 0,
            lateMinutes: 0,
            remarks: "UNSCHED",
          } as DayEvalResult);
      const deductions = computeLateDeductions(res.lateMinutes);

      // mimic old shape: r1..r4
      const sorted = [...(grouped[dateKey] || [])].sort(
        (a, b) => a.getTime() - b.getTime(),
      );
      const clip =
        sorted.length > 4
          ? [sorted[0], sorted[1], sorted[2], sorted[sorted.length - 1]]
          : sorted;
      const r = clip.slice(0, 4).reduce((acc: any, t: any, idx: number) => {
        acc[`r${idx + 1}`] = t;
        return acc;
      }, {});

      return {
        date: dateKey,
        ...r,
        name: ref,
        remarks: shift
          ? res.dayEquivalent === 0.5
            ? "HALF DAY"
            : res.remarks
          : "UNSCHED",
        totalDays: res.dayEquivalent,
        minsLate: res.lateMinutes,
        totalHours: "Regular",
        earnings: "0",
        deductions:
          deductions % 1 === 0 ? deductions.toFixed(0) : deductions.toFixed(2),
        net: "0",
      };
    });

  const totalDaysEquivalent = items.reduce(
    (sum: number, it: any) => sum + (Number(it.totalDays) || 0),
    0,
  );
  const totalMinsLate = items.reduce(
    (sum: number, it: any) => sum + (Number(it.minsLate) || 0),
    0,
  );

  return {
    items: items.sort((a: any, b: any) => a.date.localeCompare(b.date)),
    totalDays:
      totalDaysEquivalent % 1 === 0
        ? totalDaysEquivalent.toFixed(0)
        : totalDaysEquivalent.toFixed(2),
    totalMinsLate:
      totalMinsLate % 1 === 0
        ? totalMinsLate.toFixed(0)
        : totalMinsLate.toFixed(2),
  };
};
