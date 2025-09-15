import { prisma } from "@/../prisma/prisma";
import { paginationUtil } from "@/utils/tools";

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
    let searchQuery = {};
    let filterQuery = {};

    if (category) filterQuery = { ...filterQuery, category };
    if (department)
      filterQuery = { ...filterQuery, department: { $oid: department } };

    if (search) {
      searchQuery = {
        $or: [
          {
            name: { $regex: search, $options: "i" },
          },
          {
            recordNo: { $regex: search, $options: "i" },
          },
          {
            category: { $regex: search, $options: "i" },
          },
          {
            "department.name": { $regex: search, $options: "i" },
          },
        ],
      };
    }

    const rates = await prisma.employee.aggregateRaw({
      pipeline: [
        { $match: { ...filterQuery } },
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
        {
          $match: { ...searchQuery },
        },
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            items: [
              { $sort: { recordNo: 1 } },
              { $skip: page * limit },
              { $limit: limit },
            ],
          },
        },
      ],
    });

    const result = rates as any;
    const length = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
    const items = result[0].items;

    return paginationUtil(items, page, limit, length);
  } catch (error: any) {
    return null;
  }
};
