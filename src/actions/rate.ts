"use server";
import { prisma } from "../../prisma/prisma";

export const updateRate = async (
  id: string,
  payload: {
    recordNo?: string;
    name?: string;
    department?: any;
    category?: string;
    rate?: number;
    type?: string;
  }
) => {
  try {
    console.log(id, payload)
    await prisma.employee.update({
      where: { id },
      data: { ...payload, rate: parseFloat(payload.rate ? payload.rate.toString() : "0.00") },
    });

    return { success: "Employee Compensation Rate has been successfully updated!" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong, please try again later." };
  }
};
