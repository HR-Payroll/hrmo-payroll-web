import {
  computeTotalDaysAndLate,
  computeTotalDaysAndLateSingle,
} from "@/utils/computations";
import { paginationUtil } from "@/utils/tools";
import { prisma } from "../../prisma/prisma";
import { format } from "date-fns";

export const getPaginatedSummary = async (
  from: Date,
  to?: Date,
  search?: string,
  page = 0,
  limit = 10,
  category?: string,
  department?: string
) => {
  try {
    console.log(from, to);
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
              $gte: { $date: from },
              $lte: { $date: to },
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
          $match: { ...searchQuery, ...filterQuery },
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
          const { earnings, deductions, net } = computeTotalDaysAndLate(
            report.items,
            report.employee
          );
          return {
            ...report,
            earnings,
            deductions,
            net,
          };
        })
      : [];

    return paginationUtil(items, page, limit, length);
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const getSummaryById = async (id: string, from: Date, to: Date) => {
  try {
    const report = await prisma.report.aggregateRaw({
      pipeline: [
        {
          $match: {
            recordNo: id,
            timestamp: {
              $gte: { $date: from.toISOString() },
              $lte: { $date: to.toISOString() },
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
            items: 1,
          },
        },
      ],
    });

    const result = report[0] as any;

    let reports = result.items
      .map((item: any) => item.timestamp.$date)
      .reduce((acc: any, dateTime: any) => {
        const date = format(new Date(dateTime), "yyyy-MM-dd HH:mm:ss").split(
          " "
        )[0];
        acc[date] = acc[date] || [];
        acc[date].push(new Date(dateTime));
        return acc;
      }, {});

    reports = computeTotalDaysAndLateSingle(reports, result.employee);

    console.log(reports);

    return { ...result, items: reports };
  } catch (error: any) {
    console.log(error);
  }
};
