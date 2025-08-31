"use server";
import { z } from "zod";
import { EmployeeSchema } from "@/lib/zod";
import { prisma } from "../../prisma/prisma";

export const createEmployee = async (data: z.infer<typeof EmployeeSchema>) => {
  const validateData = EmployeeSchema.parse(data);

  if (!validateData) {
    return { error: "Invalid input fields" };
  }

  const { recordNo, name, category, department, schedule } = validateData;

  try {
    await prisma.employee.create({
      data: {
        recordNo: recordNo,
        name: name,
        category: category,
        department: department,
        schedule: schedule,
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
    schedule?: any;
  }
) => {
  try {
    await prisma.employee.update({
      where: { id },
      data: { ...payload, createdAt: new Date() },
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
    const bulkOps = data.map((item) => {
      const departmentValue =
        item.department && item.department !== ""
          ? { $toObjectId: item.department }
          : undefined;

      return {
        q: { recordNo: item.recordNo },
        u: [
          {
            $set: {
              ...item,
              department: departmentValue,
              schedule: { $toObjectId: item.schedule },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
        upsert: true,
        multi: false,
      };
    });

    const result = await prisma.$runCommandRaw({
      update: "Employee",
      updates: bulkOps,
    });

    return { result, success: "Employees has been uploaded successfully!" };
  } catch (error) {
    return { error: "Something went wrong, try again later." };
  }
};
