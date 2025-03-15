"use server";
import { DepartmentSchema } from "@/lib/zod";
import { z } from "zod";
import { prisma } from "../../prisma/prisma";

export const createDepartment = async (
  data: z.infer<typeof DepartmentSchema>
) => {
  const validateData = DepartmentSchema.parse(data);

  if (!validateData) {
    return { error: "Invalid input fields" };
  }

  const { name, category } = validateData;

  try {
    await prisma.department.create({
      data: { name: name, category: category },
    });

    return { success: "Department has been added successfully!" };
  } catch (error) {
    return { error: "Something went wrong, try again later." };
  }
};

export const deleteDepartment = async (id: string) => {
  try {
    await prisma.department.delete({
      where: {
        id,
      },
    });

    return { success: "Department has been deleted successfully!" };
  } catch (error) {
    return { error: "Something went wrong, try again later." };
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
    await prisma.$transaction([
      prisma.department.createMany({
        data,
      }),
    ]);

    return { success: "Department has been uploaded successfully!" };
  } catch (error) {
    return { error: "Something went wrong, try again later." };
  }
};
