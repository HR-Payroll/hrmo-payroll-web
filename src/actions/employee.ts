"use server";
import { z } from "zod";
import { EmployeeSchema } from "@/lib/zod";
import { prisma } from "../../prisma/prisma";

export const createEmployee = async (data: Employee) => {
  const validateData = EmployeeSchema.parse(data);

  if (!validateData) {
    return { error: "Invalid input fields" };
  }

  const { recordNo, name, category, departmentId, scheduleId } = validateData;

  try {
    await prisma.employee.create({
      data: {
        recordNo: recordNo,
        name: name,
        category: category,
        departmentId: departmentId,
        scheduleId: scheduleId,
      },
    });

    return { success: "Employee has been successfully added!" };
  } catch (error) {
    return { error: "Something went wrong, please try again later." };
  }
};

export const updateEmployee = async (
  id: number,
  payload: {
    recordNo?: string;
    name?: string;
    category?: string;
    department?: any;
    schedule?: any;
  }
) => {
  try {
    await prisma.employee.update({
      where: { id },
      data: { ...payload, updatedAt: new Date() },
    });

    return { success: "Employee has been successfully updated!" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong, please try again later." };
  }
};

export const deleteEmployee = async (id: number) => {
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

export const uploadEmployee = async (
  data: z.infer<typeof EmployeeSchema>[]
) => {
  for (var i = 0; i < data.length; i++) {
    const validateData = EmployeeSchema.parse(data[i]);
    if (!validateData) {
      return { error: "Invalid input fields", row: i + 1 };
    }
  }

  try {
    const result = await prisma.employee.createMany({
      data: data.map((item) => ({ ...item })),
      skipDuplicates: true,
    });

    return { result, success: "Employees has been uploaded successfully!" };
  } catch (error) {
    return { error: "Something went wrong, try again later." };
  }
};
