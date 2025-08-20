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
    to.setDate(to.getDate() + 1);
    let filterQuery = {};

    if (category) filterQuery = { ...filterQuery, category };
    if (department)
      filterQuery = { ...filterQuery, department: { $oid: department } };

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
            _id: { recordNo: "$recordNo" },
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
            let: { recordNo: "$recordNo" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$recordNo", "$$recordNo"],
                  },
                },
              },
              {
                $lookup: {
                  from: "Schedule",
                  let: { scheduleId: "$schedule" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $cond: {
                            if: {
                              $or: [
                                { $eq: ["$$scheduleId", null] },
                                { $eq: [{ $type: "$$scheduleId" }, "missing"] },
                              ],
                            },
                            then: { $eq: ["$name", "REGULAR"] },
                            else: { $eq: ["$_id", "$$scheduleId"] },
                          },
                        },
                      },
                    },
                  ],
                  as: "schedules",
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  category: 1,
                  department: 1,
                  schedule: { $arrayElemAt: ["$schedules", 0] },
                  rate: 1,
                  type: 1,
                },
              },
            ],
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
          $match: { ...filterQuery, "name.ref": { $ne: null } },
        },
        {
          $lookup: {
            from: "Department",
            let: { departmentId: "$department" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$departmentId"],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  name: 1,
                },
              },
            ],
            as: "departments",
          },
        },
        {
          $project: {
            _id: 0,
            recordNo: 1,
            name: 1,
            employee: 1,
            category: 1,
            department: { $arrayElemAt: ["$departments", 0] },
            items: 1,
            count: 1,
          },
        },

        { $sort: { recordNo: 1 } },
      ],
    });

    const result = reports as any;
    const settings = await getSettings();
    to.setDate(to.getDate() - 1);

    const items = Array.isArray(result)
      ? result.map((report: any) => {
          const { earnings, deductions, net, totalDays, late } =
            computeTotalDaysAndLate({
              dates: report.items,
              settings,
              employee: report.employee,
              filter: { from: from, to: to },
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
    return null;
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
            _id: { recordNo: "$recordNo" },
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
            let: { recordNo: "$recordNo" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$recordNo", "$$recordNo"],
                  },
                },
              },
              {
                $lookup: {
                  from: "Schedule",
                  let: { scheduleId: "$schedule" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $cond: {
                            if: {
                              $or: [
                                { $eq: ["$$scheduleId", null] },
                                { $eq: [{ $type: "$$scheduleId" }, "missing"] },
                              ],
                            },
                            then: { $eq: ["$name", "REGULAR"] },
                            else: { $eq: ["$_id", "$$scheduleId"] },
                          },
                        },
                      },
                    },
                  ],
                  as: "schedules",
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  category: 1,
                  department: 1,
                  schedule: { $arrayElemAt: ["$schedules", 0] },
                  rate: 1,
                },
              },
            ],
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

    const events = await getEventsByDateRange(from, to);
    const totalBusinessDays = getTotalBusinessDays(
      from,
      to,
      events.items || []
    );

    const settings = await getSettings();
    to.setDate(to.getDate() - 1);

    const items = Array.isArray(result[0].items)
      ? result[0].items.map((report: any) => {
          const { earnings, deductions, net, totalDays } =
            computeTotalDaysAndLate({
              dates: report.items,
              settings,
              employee: report.employee,
              businessDays: totalBusinessDays,
              filter: { from: from, to: to },
            });
          return {
            ...report,
            earnings,
            deductions,
            totalDays,
            rate: report.employee.rate,
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
    to.setDate(to.getDate() + 1);
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
            _id: { recordNo: "$recordNo" },
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
            let: { recordNo: "$recordNo" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$recordNo", "$$recordNo"],
                  },
                },
              },
              {
                $lookup: {
                  from: "Schedule",
                  let: { scheduleId: "$schedule" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $cond: {
                            if: {
                              $or: [
                                { $eq: ["$$scheduleId", null] },
                                { $eq: [{ $type: "$$scheduleId" }, "missing"] },
                              ],
                            },
                            then: { $eq: ["$name", "REGULAR"] },
                            else: { $eq: ["$_id", "$$scheduleId"] },
                          },
                        },
                      },
                    },
                  ],
                  as: "schedules",
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  category: 1,
                  department: 1,
                  schedule: { $arrayElemAt: ["$schedules", 0] },
                  rate: 1,
                },
              },
            ],
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
    if (!result) return { ...result, items: [] };

    let reports = result.items
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

    const events = await getEventsByDateRange(from, to);
    const settings = await getSettings();
    to.setDate(to.getDate() - 1);
    const totalBusinessDays = getTotalBusinessDays(
      from,
      to,
      events.items || []
    );
    const { items } = computeTotalDaysAndLateSingle({
      reports,
      settings,
      employee: result.employee,
      businessDays: totalBusinessDays,
      ref: result.name,
      filter: true,
      dates: { from, to },
    });

    return { ...result, items };
  } catch (error: any) {
    console.log(error);
  }
};
