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

    return { success: "Category has been added successfully!" };
  } catch (error) {
    return { error: "Something went wrong, try again later." };
  }
};
