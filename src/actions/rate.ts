"use server";
import { RateSchema } from "@/lib/zod";
import { z } from "zod";
import { prisma } from "../../prisma/prisma";

export const createRate = async (
  data: z.infer<typeof RateSchema>
) => {
  const validateData = RateSchema.parse(data);

  if (!validateData) {
    return { error: "Invalid input fields" };
  }

  const { category, department, employee, rate, type } = validateData;

  try {
    await prisma.rate.create({
      data: { category: category, department: department, employee: employee, rate: rate, type: type },
    });

    return { success: "Rate has been added successfully!" };
  } catch (error) {
    return { error: "Something went wrong, try again later." };
  }
};
