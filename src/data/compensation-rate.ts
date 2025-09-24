import { prisma } from "@/../prisma/prisma";
import { paginationUtil } from "@/utils/tools";

export const getRateById = async (id: number) => {
  try {
    const rate = await prisma.department.findUnique({
      where: { id },
    });

    return rate;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const getAllRate = async () => {
  try {
    const rates = await prisma.employee.findMany({
      select: {
        id: true,
        recordNo: true,
        name: true,
        category: true,
        department: true,
        type: true,
        rate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { recordNo: "asc" },
    });
    return rates;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const getPaginatedRate = async (
  search?: string,
  page = 0,
  limit = 10,
  category?: string,
  department?: string
) => {
  try {
    const where: any = {};

    if (category) where.category = category;
    if (department) where.departmentId = Number(department);

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { recordNo: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { department: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const rates = await prisma.employee.findMany({
      select: {
        id: true,
        recordNo: true,
        name: true,
        category: true,
        createdAt: true,
        department: true,
        type: true,
        rate: true,
      },
      where,
      orderBy: { recordNo: "asc" },
      skip: page * limit,
      take: limit,
    });

    const totalItems = await prisma.employee.count({ where });

    return paginationUtil(rates, page, limit, totalItems);
  } catch (error: any) {
    return paginationUtil([], page, limit, 0);
  }
};
