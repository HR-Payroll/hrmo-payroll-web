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
          $match: { name: "KIMAYA" },
        },
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
        {
          $limit: 10,
        },
      ],
    });

    return departments;
  } catch (error: any) {
    return null;
  }
};
