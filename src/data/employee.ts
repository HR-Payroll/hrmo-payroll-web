import { prisma } from "@/../prisma/prisma";

export const getEmployeeById = async (id: string) => {
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
    const employees = await prisma.employee.aggregateRaw({
      pipeline: [
        {
          $lookup: {
            from: "Department",
            localField: "department",
            foreignField: "_id",
            as: "departments",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            recordNo: 1,
            department: { $arrayElemAt: ["$departments", 0] },
            category: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ],
    });

    return employees;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
