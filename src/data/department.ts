import { prisma } from "@/../prisma/prisma";
import { paginationUtil } from "@/utils/tools";

export const getDepartmentById = async (id: number) => {
  try {
    const department = await prisma.department.findUnique({
      where: { id },
    });

    return department;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const getAllDepartment = async () => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
    });

    return departments;
  } catch (error: any) {
    console.log(error);
    return [];
  }
};

export const getPaginatedDepartment = async (
  search?: string,
  page = 0,
  limit = 10,
  category?: string,
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

    const departments = await prisma.department.findMany({
      where: { ...searchQuery, category },
      include: {
        _count: {
          select: { employees: true },
        },
      },
      orderBy: { name: "asc" },
      skip: page * limit,
      take: limit,
    });

    const totalCount = await prisma.department.count({
      where: { ...searchQuery, category },
    });

    return paginationUtil(departments, page, limit, totalCount);
  } catch (error: any) {
    return paginationUtil([], page, limit, 0);
  }
};
