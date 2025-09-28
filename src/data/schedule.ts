import { prisma } from "@/../prisma/prisma";
import { paginationUtil } from "@/utils/tools";

export const getScheduleById = async (id: number) => {
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
    const schedules = await prisma.schedule.findMany({
      orderBy: { name: "asc" },
    });

    return schedules;
  } catch (error: any) {
    return [];
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
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };
    }

    const schedules = await prisma.schedule.findMany({
      where: { ...searchQuery },
      orderBy: { name: "asc" },
      skip: page * limit,
      take: limit,
    });

    const totalCount = await prisma.schedule.count({
      where: { ...searchQuery },
    });

    return paginationUtil(schedules, page, limit, totalCount);
  } catch (error: any) {
    return null;
  }
};
