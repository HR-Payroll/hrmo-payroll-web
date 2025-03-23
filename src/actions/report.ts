"use server";
import { z } from "zod";
import { ReportSchema } from "@/lib/zod";
import { prisma } from "../../prisma/prisma";

export const uploadReport = async (data: z.infer<typeof ReportSchema>[]) => {
  for (let i = 0; i < data.length; i++) {
    const validateData = ReportSchema.parse(data[i]);
    if (!validateData) {
      return { error: "Invalid input fields", row: i + 1 };
    }
  }

  try {
    await prisma.$runCommandRaw({
      insert: "Report",
      documents: data.map((item) => ({ ...item, createdAt: new Date() })),
      ordered: false,
    });

    await Promise.all([
      prisma.$runCommandRaw({
        update: "Report",
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
          {
            q: {
              timestamp: { $type: "string" },
            },
            u: [
              {
                $set: {
                  timestamp: { $toDate: "$timestamp" },
                },
              },
            ],
            multi: true,
          },
        ],
      }),
    ]);

    return { success: "Reports have been uploaded successfully!" };
  } catch (error: any) {
    console.log(error);
    return { error: "Something went wrong, try again later." };
  }
};
