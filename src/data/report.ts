import { prisma } from "@/../prisma/prisma";
import {
  computeTotalDaysAndLate,
  getTotalBusinessDays,
} from "@/utils/computations";
import { stringToDate } from "@/utils/dateFormatter";
import moment from "moment-timezone";
import { format } from "date-fns";
import { paginationUtil } from "@/utils/tools";

export const getAllReport = async (
  from: Date,
  to: Date,
  filters?: { category?: string; department?: string }
) => {
  try {
    to.setDate(to.getDate() + 1);
    const reports = await prisma.report.aggregateRaw({
      pipeline: [
        {
          $match: { timestamp: { $gte: { $date: from }, $lte: { $date: to } } },
        },
        {
          $group: {
            _id: { recordNo: "$recordNo", name: "$name" },
            count: { $sum: 1 },
            items: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            recordNo: "$_id.recordNo",
            name: { name: "$_id.name", data: null },
            items: 1,
            count: 1,
          },
        },
        {
          $lookup: {
            from: "Employee",
            localField: "recordNo",
            foreignField: "recordNo",
            as: "employee",
          },
        },
        {
          $project: {
            _id: 0,
            recordNo: 1,
            name: {
              name: { $arrayElemAt: ["$employee.name", 0] },
              data: { $arrayElemAt: ["$employee", 0] },
            },
            employee: { $arrayElemAt: ["$employee", 0] },
            category: { $arrayElemAt: ["$employee.category", 0] },
            department: { $arrayElemAt: ["$employee.department", 0] },
            items: 1,
            count: 1,
          },
        },
        {
          $match: { "name.ref": { $ne: null } },
        },
        {
          $sort: { recordNo: 1 },
        },
      ],
    });

    const temp = Array.isArray(reports)
      ? reports.map((report: any) => {
          const { totalDays, late } = computeTotalDaysAndLate(
            report.items,
            report.employee
          );
          return {
            ...report,
            numDays: totalDays,
            late,
          };
        })
      : [];

    return temp;
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
  department?: string
) => {
  try {
    to.setDate(to.getDate() + 1);

    let searchQuery = {};
    let filterQuery = {};

    if (category) filterQuery = { ...filterQuery, category };
    if (department)
      filterQuery = { ...filterQuery, department: { $oid: department } };

    if (search) {
      searchQuery = {
        $or: [
          {
            name: { $regex: search, $options: "i" },
          },
          {
            recordNo: { $regex: search, $options: "i" },
          },
        ],
      };
    }

    const reports = await prisma.report.aggregateRaw({
      pipeline: [
        {
          $match: {
            timestamp: {
              $gte: from.toISOString(),
              $lte: to.toISOString(),
            },
          },
        },
        {
          $group: {
            _id: { recordNo: "$recordNo", name: "$name" },
            count: { $sum: 1 },
            items: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            recordNo: "$_id.recordNo",
            name: { name: "$_id.name", ref: null },
            items: 1,
            count: 1,
          },
        },
        {
          $lookup: {
            from: "Employee",
            localField: "recordNo",
            foreignField: "recordNo",
            as: "employee",
          },
        },
        {
          $project: {
            _id: 0,
            recordNo: 1,
            name: {
              name: { $arrayElemAt: ["$employee.name", 0] },
              ref: { $arrayElemAt: ["$employee._id", 0] },
            },
            employee: { $arrayElemAt: ["$employee", 0] },
            category: { $arrayElemAt: ["$employee.category", 0] },
            department: { $arrayElemAt: ["$employee.department", 0] },
            items: 1,
            count: 1,
          },
        },
        {
          $match: { ...searchQuery, ...filterQuery, "name.ref": { $ne: null } },
        },
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            items: [
              { $sort: { recordNo: 1 } },
              { $skip: page * limit },
              { $limit: limit },
            ],
          },
        },
      ],
    });

    const result = reports as any;
    const length = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
    const items = Array.isArray(result[0].items)
      ? result[0].items.map((report: any) => {
          const { totalDays, late } = computeTotalDaysAndLate(
            report.items,
            report.employee
          );
          return {
            ...report,
            numDays: totalDays,
            late,
          };
        })
      : [];

    return paginationUtil(items, page, limit, length);
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const getReportById = async (id: string, from: Date, to: Date) => {
  try {
    to.setDate(to.getDate() + 1);

    console.log(from, to);
    const report = await prisma.report.aggregateRaw({
      pipeline: [
        {
          $match: {
            recordNo: id,
            timestamp: {
              $gte: from.toISOString(),
              $lte: to.toISOString(),
            },
          },
        },
        {
          $group: {
            _id: { name: "$name", recordNo: "$recordNo" },
            count: { $sum: 1 },
            items: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            recordNo: "$_id.recordNo",
            name: { name: "$_id.name", ref: null },
            items: 1,
          },
        },
        {
          $lookup: {
            from: "Employee",
            localField: "recordNo",
            foreignField: "recordNo",
            as: "employee",
          },
        },
        {
          $project: {
            _id: 0,
            recordNo: 1,
            name: {
              name: { $arrayElemAt: ["$employee.name", 0] },
              ref: { $arrayElemAt: ["$employee._id", 0] },
            },
            employee: { $arrayElemAt: ["$employee", 0] },
            category: { $arrayElemAt: ["$employee.category", 0] },
            department: { $arrayElemAt: ["$employee.department", 0] },
            items: 1,
          },
        },
      ],
    });

    const result = report[0] as any;

    let reports = result.items
      .map((item: any) => item.timestamp)
      .reduce((acc: any, dateTime: any) => {
        const date = format(new Date(dateTime), "yyyy-MM-dd HH:mm:ss").split(
          " "
        )[0];
        acc[date] = acc[date] || [];
        acc[date].push(new Date(dateTime));
        return acc;
      }, {});

    reports = Object.keys(reports)
      .sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime())
      .map((date) => {
        const times = reports[date].sort(
          (a: Date, b: Date) => a.getTime() - b.getTime()
        );

        const items = times
          .slice(0, 4)
          .reduce((acc: any, time: any, index: number) => {
            acc[`r${index + 1}`] = time;
            return acc;
          }, {});

        return {
          date,
          name: result.name,
          ...items,
        };
      });

    return { ...result, items: reports };
  } catch (error: any) {
    console.log(error);
  }
};
