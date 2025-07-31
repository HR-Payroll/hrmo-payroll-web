"use server";
import { z } from "zod";
import { DepartmentSchema } from "@/lib/zod";
import { prisma } from "../../prisma/prisma";

export const createDepartment = async (
  data: z.infer<typeof DepartmentSchema>
) => {
  const validateData = DepartmentSchema.parse(data);

  if (!validateData) {
    return { error: "Invalid input fields" };
  }

  const { name, category, index } = validateData;

  try {
    await prisma.department.create({
      data: { name, category, index: index as string },
    });

    return { success: "Department has been successfully added!" };
  } catch (error) {
    return { error: "Something went wrong, please try again later." };
  }
};

export const updateDepartment = async (
  id: string,
  payload: {
    name?: string;
    category?: string;
  }
) => {
  try {
    await prisma.employee.update({
      where: { id },
      data: { ...payload },
    });

    return { success: "Department has been successfully updated!" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong, please try again later." };
  }
};

export const deleteDepartment = async (id: string) => {
  try {
    await prisma.department.delete({
      where: {
        id,
      },
    });

    return { success: "Department has been successfully deleted!" };
  } catch (error) {
    return { error: "Something went wrong, please try again later." };
  }
};

export const uploadDepartment = async (
  data: z.infer<typeof DepartmentSchema>[]
) => {
  for (var i = 0; i < data.length; i++) {
    const validateData = DepartmentSchema.parse(data[i]);
    if (!validateData) {
      return { error: "Invalid input fields", row: i + 1 };
    }
  }

  try {
    await prisma.$runCommandRaw({
      insert: "Department",
      documents: data.map((item) => ({ ...item, createdAt: new Date() })),
      ordered: false,
    });

    await Promise.all([
      prisma.$runCommandRaw({
        update: "Department",
        updates: [
          {
            q: {
              createdAt: { $type: "string" },
            },
            u: [
              {
                $set: {
                  createdAt: { $toDate: "$createdAt" },
                },
              },
            ],
            multi: true,
          },
        ],
      }),
    ]);

    return { success: "Department has been uploaded successfully!" };
  } catch (error) {
    return { error: "Something went wrong, try again later." };
  }
};
