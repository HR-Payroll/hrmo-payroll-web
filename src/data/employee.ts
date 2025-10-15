import { prisma } from "@/../prisma/prisma";
import { paginationUtil } from "@/utils/tools";

export const getEmployeeById = async (id: number) => {
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

export const getAllEmployee = async () => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
      },
      orderBy: { recordNo: "asc" },
    });
    return employees;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const getPaginatedEmployee = async (
  search?: string,
  page = 0,
  limit = 10,
  category?: string,
  department?: number
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
        { schedule: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const items = await prisma.employee.findMany({
      select: {
        id: true,
        recordNo: true,
        name: true,
        category: true,
        createdAt: true,
        department: true,
        schedule: true,
      },
      where,
      orderBy: { recordNo: "asc" },
      skip: page * limit,
      take: limit,
    });

    const totalItems = await prisma.employee.count({ where });
    const regularSchedule = await prisma.schedule.findFirst({
      where: { name: "REGULAR" },
    });

    const employees = items.map((e) => ({
      ...e,
      schedule: e.schedule ?? regularSchedule,
    }));

    return paginationUtil(employees, page, limit, totalItems);
  } catch (error: any) {
    return paginationUtil([], page, limit, 0);
  }
};
