import { prisma } from "@/../prisma/prisma";
import { paginationUtil } from "@/utils/tools";

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

export const getAllDepartment = async (
  search?: string,
  page = 0,
  limit = 10
) => {
  try {
    let searchQuery = {};

    if (search) {
      searchQuery = {
        $or: [{ name: { $regex: search, $options: "i" } }],
      };
    }

    const departments = await prisma.department.aggregateRaw({
      pipeline: [
        {
          $match: { ...searchQuery },
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
          $facet: {
            totalCount: [{ $count: "count" }],
            items: [
              { $sort: { name: -1 } },
              { $skip: page * limit },
              { $limit: limit },
            ],
          },
        },
      ],
    });

    const result = departments as any;
    const length = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
    const items = result[0].items;

    return paginationUtil(items, page, limit, length);
  } catch (error: any) {
    return null;
  }
};
