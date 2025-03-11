import { prisma } from "@/../prisma/prisma";

export const getRateById = async (id: string) => {
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
    const rates = await prisma.employee.aggregateRaw({
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
            rate: 1,
            type: 1,
            category: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ],
    });

    console.log(rates);
    return rates;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
