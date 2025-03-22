import { prisma } from "@/../prisma/prisma";
import { computeTotalDaysAndLate } from "@/utils/computations";
import { stringToDate } from "@/utils/dateFormatter";
import moment from "moment-timezone";
import { format } from "date-fns";

export const getAllReport = async (
  from: Date,
  to?: Date,
  filters?: { category?: string; department?: string }
) => {
  try {
    console.log(from, to);
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
            name: "$_id.name",
            count: 1,
            items: 1,
          },
        },
        {
          $sort: { recordNo: 1 },
        },
      ],
    });

    const temp = Array.isArray(reports)
      ? reports.map((report: any) => {
          const { totalDays, late } = computeTotalDaysAndLate(report.items);
          return {
            ...report,
            numDays: totalDays,
            late,
          };
        })
      : [];

    console.log(temp);
    return temp;
  } catch (error: any) {
    return null;
  }
};

export const getPaginatedReport = async (
  from: Date,
  to?: Date,
  search?: string,
  page = 0,
  limit = 10,
  filters?: { category?: string; department?: string }
) => {
  try {
    let searchQuery = {};

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
            ...searchQuery,
            timestamp: { $gte: { $date: from }, $lte: { $date: to } },
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
            name: "$_id.name",
            count: 1,
            items: 1,
          },
        },
        {
          $sort: { recordNo: 1 },
        },
      ],
    });

    const temp = Array.isArray(reports)
      ? reports.map((report: any) => {
          const { totalDays, late } = computeTotalDaysAndLate(report.items);
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

export const getReportById = async (id: string, from: Date, to: Date) => {
  try {
    const report = await prisma.report.aggregateRaw({
      pipeline: [
        {
          $match: {
            recordNo: id,
            timestamp: { $gte: { $date: from }, $lte: { $date: to } },
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
            name: "$_id.name",
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
