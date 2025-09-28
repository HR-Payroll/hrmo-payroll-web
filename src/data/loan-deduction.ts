import { prisma } from "@/../prisma/prisma";
import { paginationUtil } from "@/utils/tools";

export const getLDeductionById = async (id: number) => {
  try {
    const deduction = await prisma.employee.findUnique({
      where: { id },
    });

    return deduction;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const getAllLDeduction = async () => {
  try {
    const deductions = await prisma.employee.findMany({
      select: {
        id: true,
        recordNo: true,
        name: true,
        category: true,
        department: true,
        mplhdmf: true,
        gfal: true,
        landbank: true,
        cb: true,
        eml: true,
        mplgsis: true,
        tagum: true,
        ucpb: true,
        mpllite: true,
        sb: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { recordNo: "asc" },
    });
    return deductions;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const getPaginatedLDeduction = async (
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

    const deductions = await prisma.employee.findMany({
      select: {
        id: true,
        recordNo: true,
        name: true,
        category: true,
        createdAt: true,
        department: true,
        mplhdmf: true,
        gfal: true,
        landbank: true,
        cb: true,
        eml: true,
        mplgsis: true,
        tagum: true,
        ucpb: true,
        mpllite: true,
        sb: true,
      },
      where,
      orderBy: { recordNo: "asc" },
      skip: page * limit,
      take: limit,
    });

    const totalItems = await prisma.employee.count({ where });

    return paginationUtil(deductions, page, limit, totalItems);
  } catch (error: any) {
    return paginationUtil([], page, limit, 0);
  }
};
