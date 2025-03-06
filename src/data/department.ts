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
    const departments = await prisma.department.aggregateRaw({
      pipeline: [
        {
          $lookup: {
            from: "Employee",
            localField: "_id",
            foreignField: "department",
            as: "employees",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            employees: { $size: "$employees" },
            category: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ],
    });

    console.log(departments);
    return departments;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
