"use server";
import { EmployeeSchema } from "@/lib/zod";
import { z } from "zod";
import { prisma } from "../../prisma/prisma";

export const createEmployee = async (data: z.infer<typeof EmployeeSchema>) => {
  const validateData = EmployeeSchema.parse(data);

  if (!validateData) {
    return { error: "Invalid input fields" };
  }

  const { recordNo, name, category, department } = validateData;

  try {
    await prisma.employee.create({
      data: {
        recordNo: recordNo,
        name: name,
        category: category,
        department: department,
      },
    });

    return { success: "Employee has been added successfully!" };
  } catch (error) {
    return { error: "Something went wrong, try again later." };
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    await prisma.employee.delete({
      where: {
        id,
      },
    });

    return { success: "Employee has been deleted successfully!" };
  } catch (error) {
    return { error: "Something went wrong, try again later." };
  }
};
