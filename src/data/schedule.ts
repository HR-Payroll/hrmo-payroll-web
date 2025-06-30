import { prisma } from "@/../prisma/prisma";
import { paginationUtil } from "@/utils/tools";

export const getScheduleById = async (id: string) => {
  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
    });

    return schedule;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const getAllSchedules = async () => {
  try {
    const schedules = await prisma.schedule.aggregateRaw({
      pipeline: [
        {
          $project: {
            _id: 1,
            name: 1,
            inTime: 1,
            outTime: 1,
            daysIncluded: 1,
            readOnly: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        { $sort: { name: 1 } },
      ],
    });

    return schedules;
  } catch (error: any) {
    return null;
  }
};

export const getPaginatedSchedule = async (
  search?: string,
  page = 0,
  limit = 10
) => {
  try {
    let searchQuery = {};

    if (search) {
      searchQuery = {
        $or: [{ name: { $regex: search, $options: "i" } }],
      };
    }

    const schedules = await prisma.schedule.aggregateRaw({
      pipeline: [
        {
          $match: { ...searchQuery },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            inTime: 1,
            outTime: 1,
            daysIncluded: 1,
            readOnly: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            items: [
              { $sort: { name: 1 } },
              { $skip: page * limit },
              { $limit: limit },
            ],
          },
        },
      ],
    });

    const result = schedules as any;
    const length = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
    const items = result && result[0] ? result[0].items : [];

    return paginationUtil(items, page, limit, length);
  } catch (error: any) {
    return null;
  }
};
