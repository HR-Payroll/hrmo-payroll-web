import { prisma } from "@/../prisma/prisma";
import { paginationUtil } from "@/utils/tools";

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

export const getPaginatedEmployee = async (
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

    const employees = await prisma.employee.aggregateRaw({
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
          $lookup: {
            from: "Schedule",
            let: { schedule: "$schedule" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $cond: {
                      if: {
                        $or: [
                          { $eq: ["$schedule", null] },
                          { $eq: [{ $type: "$schedule" }, "missing"] },
                        ],
                      },
                      then: { $eq: ["$name", "Regular"] },
                      else: { $eq: ["$_id", "$$schedule"] },
                    },
                  },
                },
              },
            ],
            as: "schedules",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            recordNo: 1,
            department: { $arrayElemAt: ["$departments", 0] },
            category: 1,
            schedule: { $arrayElemAt: ["$schedules", 0] },
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

    const result = employees as any;
    const length = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
    const items = result[0].items;

    return paginationUtil(items, page, limit, length);
  } catch (error: any) {
    return null;
  }
};
