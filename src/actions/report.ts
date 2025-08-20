"use server";
import { z } from "zod";
import { ReportSchema } from "@/lib/zod";
import { prisma } from "../../prisma/prisma";

export const createReport = async (data: z.infer<typeof ReportSchema>) => {
  const validateData = ReportSchema.parse(data);

  if (!validateData) {
    return { error: "Invalid input fields" };
  }

  const { name, recordNo, timestamp, index } = validateData;

  try {
    await prisma.report.create({
      data: { recordNo, name, timestamp, index },
    });

    return { success: "Report has been successfully added!" };
  } catch (error) {
    return { error: "Something went wrong, please try again later." };
  }
};

export const updateReport = async (
  id: string,
  payload: {
    recordNo?: string;
    name?: string;
    timestamp?: string;
    index?: string;
  }
) => {
  try {
    await prisma.report.update({
      where: { id },
      data: { ...payload },
    });

    return { success: "Report has been successfully updated!" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong, please try again later." };
  }
};

export const deleteReport = async (id: string) => {
  try {
    await prisma.report.delete({
      where: {
        id,
      },
    });

    return { success: "Report has been successfully deleted!" };
  } catch (error) {
    return { error: "Something went wrong, please try again later." };
  }
};

export const uploadReport = async (data: z.infer<typeof ReportSchema>[]) => {
  for (let i = 0; i < data.length; i++) {
    const validateData = ReportSchema.parse(data[i]);
    if (!validateData) {
      return { error: "Invalid input fields", row: i + 1 };
    }
  }

  try {
    const bulkOps = data.map((item) => {
      return {
        q: { index: item.index },
        u: [
          {
            $set: {
              ...item,
              createdAt: new Date(),
            },
          },
        ],
        upsert: true,
        multi: false,
      };
    });

    const result = await prisma.$runCommandRaw({
      update: "Report",
      updates: bulkOps,
    });

    return { result, success: "Reports have been uploaded successfully!" };
  } catch (error: any) {
    console.log(error);
    return { error: "Something went wrong, try again later." };
  }
};
