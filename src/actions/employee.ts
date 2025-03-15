"use server";
import { z } from "zod";
import { EmployeeSchema } from "@/lib/zod";
import { prisma } from "../../prisma/prisma";

export const createEmployee = async (
  data: z.infer<typeof EmployeeSchema>
) => {
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

    return { success: "Employee has been successfully added!" };
  } catch (error) {
    return { error: "Something went wrong, please try again later." };
  }
};

export const updateEmployee = async (
  id: string,
  payload: {
    recordNo?: string;
    name?: string;
    category?: string;
    department?: any;
  }
) => {
  try {
    await prisma.employee.update({
      where: { id },
      data: { ...payload },
    });

    return { success: "Employee has been successfully updated!" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong, please try again later." };
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    await prisma.employee.delete({
      where: {
        id,
      },
    });

    return { success: "Employee has been successfully deleted!" };
  } catch (error) {
    return { error: "Something went wrong, please try again later." };
  }
};
