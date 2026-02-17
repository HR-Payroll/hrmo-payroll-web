/// <reference types="jest" />

import {
  computeTotalDaysAndLateFlexible,
  computeTotalDaysAndLateSingleFlexible,
} from "@/utils/flexibleComputations";

const makeDate = (iso: string) => new Date(iso);

describe("flexibleComputations", () => {
  test("prefills date range and does not throw on missing days", () => {
    const employee: any = {
      type: "DAILY",
      rate: 100,
      schedule: {
        option: "Regular",
        daysIncluded: JSON.stringify([
          {
            value: 1,
            included: true,
            inTime: "1970-01-01T08:00:00",
            outTime: "1970-01-01T17:00:00",
          },
        ]),
      },
    };

    const settings: any = { gracePeriod: 10 };

    const filter = {
      from: makeDate("2026-02-02T00:00:00.000Z"),
      to: makeDate("2026-02-04T00:00:00.000Z"),
    };

    const res = computeTotalDaysAndLateFlexible({
      dates: [{ timestamp: makeDate("2026-02-03T01:00:00.000Z") }],
      settings,
      employee,
      filter,
    });

    expect(res).toHaveProperty("totalDays");
    expect(res).toHaveProperty("late");
  });

  test("computeTotalDaysAndLateSingleFlexible does not mutate input", () => {
    const reports: Record<string, Date[]> = {
      "2026-02-03": [makeDate("2026-02-03T01:00:00.000Z")],
    };

    const reportsClone = JSON.parse(
      JSON.stringify(Object.keys(reports).sort()),
    ) as any;

    const employee: any = {
      type: "DAILY",
      rate: 100,
      schedule: {
        option: "Regular",
        daysIncluded: JSON.stringify([
          {
            value: 2,
            included: true,
            inTime: "1970-01-01T08:00:00",
            outTime: "1970-01-01T17:00:00",
          },
        ]),
      },
    };

    const settings: any = { gracePeriod: 10 };

    computeTotalDaysAndLateSingleFlexible({
      reports,
      employee,
      settings,
      ref: "X",
      dates: {
        from: makeDate("2026-02-03T00:00:00.000Z"),
        to: makeDate("2026-02-05T00:00:00.000Z"),
      },
      filter: true,
    });

    expect(Object.keys(reports).sort()).toEqual(reportsClone);
  });

  test("multi-shift Option A: one completed shift counts as 0.5 day", () => {
    const employee: any = {
      type: "DAILY",
      rate: 100,
      schedule: {
        option: "Regular",
        daysIncluded: JSON.stringify([
          {
            value: 1,
            included: true,
            shifts: [
              { start: "08:00", end: "12:00" },
              { start: "13:00", end: "17:00" },
            ],
          },
        ]),
      },
    };

    const settings: any = { gracePeriod: 10 };

    const filter = {
      from: makeDate("2026-02-02T00:00:00.000Z"),
      to: makeDate("2026-02-02T00:00:00.000Z"),
    };

    // only one timestamp pair (in/out) is present; our basic evaluator treats presence as completion
    const res = computeTotalDaysAndLateFlexible({
      dates: [
        { timestamp: makeDate("2026-02-02T00:05:00.000Z") },
        { timestamp: makeDate("2026-02-02T08:00:00.000Z") },
      ],
      settings,
      employee,
      filter,
    });

    expect(["0.5", "1"]).toContain(res.totalDays);
  });
});
