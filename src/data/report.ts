import { prisma } from "@/../prisma/prisma";
import {
  computeTotalDaysAndLate,
  computeTotalDaysAndLateSingle,
} from "@/utils/computations";
import { format } from "date-fns";
import { paginationUtil } from "@/utils/tools";
import { getSettings } from "@/actions/settings";

export const getAllReport = async (
  from: Date,
  to: Date,
  filters?: { category?: string; department?: string }
) => {
  try {
    const tableFilter: any = {};
    const dateFilter: any = {
      timestamp: {
        gte: from,
        lte: to,
      },
    };

    if (filters && filters.category) tableFilter.category.id = filters.category;
    if (filters && filters.department)
      tableFilter.departmentId = filters.department;

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
          const { totalDays, late } = computeTotalDaysAndLate({
            dates: report.reports,
            employee: report,
            settings,
            filter: { from, to },
          });
          return {
            ...report,
            numDays: totalDays,
            late,
          };
        })
      : [];

    return items;

    // const reports = await prisma.report.aggregateRaw({
    //   pipeline: [
    //     {
    //       $match: { timestamp: { $gte: { $date: from }, $lte: { $date: to } } },
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
    //         name: { name: "$_id.name", data: null },
    //         items: 1,
    //         count: 1,
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
    //           data: { $arrayElemAt: ["$employee", 0] },
    //         },
    //         employee: { $arrayElemAt: ["$employee", 0] },
    //         category: { $arrayElemAt: ["$employee.category", 0] },
    //         department: { $arrayElemAt: ["$employee.department", 0] },
    //         items: 1,
    //         count: 1,
    //       },
    //     },
    //     {
    //       $match: { "name.ref": { $ne: null } },
    //     },
    //     {
    //       $sort: { recordNo: 1 },
    //     },
    //   ],
    // });

    // const temp = Array.isArray(reports)
    //   ? reports.map((report: any) => {
    //       const { totalDays, late } = computeTotalDaysAndLate({
    //         dates: report.items,
    //         employee: report.employee,
    //         settings,
    //         filter: { from, to },
    //       });
    //       return {
    //         ...report,
    //         numDays: totalDays,
    //         late,
    //       };
    //     })
    //   : [];

    // return temp;
  } catch (error: any) {
    return null;
  }
};

export const getPaginatedReport = async (
  from: Date,
  to: Date,
  search?: string,
  page = 0,
  limit = 10,
  category?: string,
  department?: number
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

    const settings = await getSettings();

    const items = Array.isArray(reports)
      ? reports.map((report: any) => {
          const { totalDays, late } = computeTotalDaysAndLate({
            dates: report.reports,
            employee: report,
            settings,
            filter: { from, to },
          });
          return {
            ...report,
            numDays: totalDays,
            late,
          };
        })
      : [];

    return paginationUtil(items, page, limit, totalItems);
  } catch (error: any) {
    console.log(error);
    return paginationUtil([], page, limit, 0);
  }
};

export const getReportById = async (id: string, from: Date, to: Date) => {
  try {
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

    const settings = await getSettings();

    let reports = results
      .map((item: any) => item.timestamp)
      .reduce((acc: any, dateTime: any) => {
        const date = format(new Date(dateTime), "yyyy-MM-dd HH:mm:ss").split(
          " "
        )[0];
        acc[date] = acc[date] || [];
        acc[date].push(new Date(dateTime));
        return acc;
      }, {});

    const { items, totalDays, totalMinsLate } = computeTotalDaysAndLateSingle({
      reports,
      employee,
      settings,
      ref: employee!.name,
      dates: { from, to },
    });

    // const { totalDays } = computeTotalDaysAndLate({
    //   dates: result.items,
    //   employee: result.employee,
    //   settings,
    // });

    // let reports = result.items
    //   .map((item: any) => item.timestamp)
    //   .reduce((acc: any, dateTime: any) => {
    //     const date = format(
    //       dateTz(new Date(dateTime)),
    //       "yyyy-MM-dd HH:mm:ss"
    //     ).split(" ")[0];
    //     acc[date] = acc[date] || [];
    //     acc[date].push(dateTz(new Date(dateTime)));
    //     return acc;
    //   }, {});

    // reports = Object.keys(reports)
    //   .sort(
    //     (a: any, b: any) =>
    //       dateTz(new Date(b)).getTime() - dateTz(new Date(a)).getTime()
    //   )
    //   .map((date) => {
    //     const times = reports[date].sort(
    //       (a: Date, b: Date) => dateTz(a).getTime() - dateTz(b).getTime()
    //     );

    //     let filterTimes = times;
    //     if (times.length > 4) {
    //       filterTimes = [times[0], times[1], times[2], times[times.length - 1]];
    //     }

    //     const items = filterTimes
    //       .slice(0, 4)
    //       .reduce((acc: any, time: any, index: number) => {
    //         acc[`r${index + 1}`] = time;
    //         return acc;
    //       }, {});

    //     return {
    //       date,
    //       name: result.name,
    //       ...items,
    //     };
    //   });

    return {
      employee,
      items,
      totalDays,
      totalLate: totalMinsLate,
    };
  } catch (error: any) {
    console.log(error);
  }
};
