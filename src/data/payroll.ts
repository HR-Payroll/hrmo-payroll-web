import {
  computeTotalDaysAndLate,
  computeTotalDaysAndLateSingle,
  getTotalBusinessDays,
} from "@/utils/computations";
import { paginationUtil } from "@/utils/tools";
import { prisma } from "../../prisma/prisma";
import { format } from "date-fns";
import { getEventsByDateRange } from "@/actions/events";
import { getSettings } from "@/actions/settings";
import { dateTz } from "@/utils/dateFormatter";

export const getAllSummary = async (
  from: Date,
  to: Date,
  category?: string,
  department?: string
) => {
  try {
    const tableFilter: any = {};
    const dateFilter: any = {
      timestamp: {
        gte: from,
        lte: to,
      },
    };

    if (category) tableFilter.category = category;
    if (department) tableFilter.departmentId = department;

    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        recordNo: true,
        name: true,
        category: true,
        createdAt: true,
        department: true,
        schedule: true,
        type: true,
        rate: true,
      },
      where: {
        ...tableFilter,
      },
      orderBy: { recordNo: "asc" },
    });

    const recordNos = employees.map((emp) => emp.recordNo);

    const results = await prisma.report.findMany({
      where: {
        ...dateFilter,
        recordNo: { in: recordNos },
      },
      orderBy: { recordNo: "asc" },
    });

    const reportsMap = results.reduce((acc, rep) => {
      (acc[rep.recordNo] ??= []).push(rep);
      return acc;
    }, {} as Record<string, typeof results>);

    const reports = employees.map((emp) => {
      const empReports = reportsMap[emp.recordNo] ?? [];
      return {
        ...emp,
        reports: empReports,
        reportCount: empReports.length,
      };
    });

    const settings = await getSettings();

    const items = Array.isArray(reports)
      ? reports.map((report: any) => {
          const { totalDays, late, earnings, deductions, net } =
            computeTotalDaysAndLate({
              dates: report.reports,
              employee: report,
              settings,
              filter: { from, to },
            });
          return {
            ...report,
            earnings,
            deductions,
            net,
            totalDays,
            late,
          };
        })
      : [];

    return items;
  } catch (error: any) {
    console.log(error);
    return [];
  }
};

export const getPaginatedSummary = async (
  from: Date,
  to: Date,
  search?: string,
  page = 0,
  limit = 10,
  category?: string,
  department?: string
) => {
  try {
    const searchQuery: any = {};
    const tableFilter: any = {};
    const dateFilter: any = {
      timestamp: {
        gte: from,
        lte: to,
      },
    };

    if (category) tableFilter.category = category;
    if (department) tableFilter.departmentId = Number(department);

    if (search) {
      searchQuery.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { recordNo: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { department: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        recordNo: true,
        name: true,
        category: true,
        createdAt: true,
        department: true,
        schedule: true,
        type: true,
        rate: true,
      },
      where: {
        ...tableFilter,
        ...searchQuery,
      },
      orderBy: { recordNo: "asc" },
      skip: page * limit,
      take: limit,
    });

    const totalItems = await prisma.employee.count({
      where: {
        ...tableFilter,
        ...searchQuery,
      },
    });
    const recordNos = employees.map((emp) => emp.recordNo);

    const results = await prisma.report.findMany({
      where: {
        ...dateFilter,
        recordNo: { in: recordNos },
      },
      orderBy: { recordNo: "asc" },
    });

    const reportsMap = results.reduce((acc, rep) => {
      (acc[rep.recordNo] ??= []).push(rep);
      return acc;
    }, {} as Record<string, typeof results>);

    const reports = employees.map((emp) => {
      const empReports = reportsMap[emp.recordNo] ?? [];
      return {
        ...emp,
        reports: empReports,
        reportCount: empReports.length,
      };
    });

    const events = await getEventsByDateRange(from, to);
    const totalBusinessDays = getTotalBusinessDays(
      from,
      to,
      events.items || []
    );

    const settings = await getSettings();

    const items = Array.isArray(reports)
      ? reports.map((report: any) => {
          const { totalDays, earnings, deductions, net } =
            computeTotalDaysAndLate({
              dates: report.reports,
              employee: report,
              settings,
              businessDays: totalBusinessDays,
              filter: { from, to },
            });
          return {
            ...report,
            earnings,
            deductions,
            totalDays,
            rate: report.rate,
            net,
          };
        })
      : [];

    return paginationUtil(items, page, limit, totalItems);
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const getSummaryById = async (id: string, from: Date, to: Date) => {
  try {
    // to.setDate(to.getDate() + 1);
    // const report = await prisma.report.aggregateRaw({
    //   pipeline: [
    //     {
    //       $match: {
    //         recordNo: id,
    //         timestamp: {
    //           $gte: from.toISOString(),
    //           $lte: to.toISOString(),
    //         },
    //       },
    //     },
    //     {
    //       $group: {
    //         _id: { recordNo: "$recordNo" },
    //         count: { $sum: 1 },
    //         items: { $push: "$$ROOT" },
    //       },
    //     },
    //     {
    //       $project: {
    //         _id: 0,
    //         recordNo: "$_id.recordNo",
    //         name: { name: "$_id.name", ref: null },
    //         items: 1,
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "Employee",
    //         let: { recordNo: "$recordNo" },
    //         pipeline: [
    //           {
    //             $match: {
    //               $expr: {
    //                 $eq: ["$recordNo", "$$recordNo"],
    //               },
    //             },
    //           },
    //           {
    //             $lookup: {
    //               from: "Schedule",
    //               let: { scheduleId: "$schedule" },
    //               pipeline: [
    //                 {
    //                   $match: {
    //                     $expr: {
    //                       $cond: {
    //                         if: {
    //                           $or: [
    //                             { $eq: ["$$scheduleId", null] },
    //                             { $eq: [{ $type: "$$scheduleId" }, "missing"] },
    //                           ],
    //                         },
    //                         then: { $eq: ["$name", "REGULAR"] },
    //                         else: { $eq: ["$_id", "$$scheduleId"] },
    //                       },
    //                     },
    //                   },
    //                 },
    //               ],
    //               as: "schedules",
    //             },
    //           },
    //           {
    //             $project: {
    //               _id: 1,
    //               name: 1,
    //               category: 1,
    //               department: 1,
    //               schedule: { $arrayElemAt: ["$schedules", 0] },
    //               rate: 1,
    //             },
    //           },
    //         ],
    //         as: "employee",
    //       },
    //     },
    //     {
    //       $project: {
    //         _id: 0,
    //         recordNo: 1,
    //         name: {
    //           name: { $arrayElemAt: ["$employee.name", 0] },
    //           ref: { $arrayElemAt: ["$employee._id", 0] },
    //         },
    //         employee: { $arrayElemAt: ["$employee", 0] },
    //         items: 1,
    //       },
    //     },
    //   ],
    // });

    const employee = await prisma.employee.findUnique({
      where: { recordNo: id },
      select: {
        id: true,
        recordNo: true,
        name: true,
        category: true,
        createdAt: true,
        department: true,
        schedule: true,
        type: true,
        rate: true,
      },
    });

    const results = await prisma.report.findMany({
      where: {
        recordNo: id,
        timestamp: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { timestamp: "asc" },
    });

    const events = await getEventsByDateRange(from, to);
    const settings = await getSettings();
    const totalBusinessDays = getTotalBusinessDays(
      from,
      to,
      events.items || []
    );

    let reports = results
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

    const { items } = computeTotalDaysAndLateSingle({
      reports,
      employee,
      settings,
      ref: employee!.name,
      businessDays: totalBusinessDays,
      dates: { from, to },
      filter: true,
    });

    return { ...employee, items };
  } catch (error: any) {
    console.log(error);
  }
};
