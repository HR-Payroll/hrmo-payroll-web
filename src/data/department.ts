import { prisma } from "@/../prisma/prisma";

export const getDepartmentById = async (id: string) => {
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
    const departments = await prisma.department.findMany();

    return departments;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
