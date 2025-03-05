"use server";
import { MandatorySchema } from "@/lib/zod";
import { z } from "zod";
import { prisma } from "../../prisma/prisma";

export const createDeductions = async (
  data: z.infer<typeof MandatorySchema>
) => {
  const validateData = MandatorySchema.parse(data);

  if (!validateData) {
    return { error: "Invalid input fields" };
  }

  const {
    category,
    department,
    employee,
    gsisgs,
    ec,
    gsisps,
    phic,
    hdmfgs,
    hdmfps,
    wtax,
    sss,
  } = validateData;

  try {
    await prisma.mandatory.create({
      data: {
        category: category,
        department: department,
        employee: employee,
        gsisgs: gsisgs,
        ec: ec,
        gsisps: gsisps,
        phic: phic,
        hdmfgs: hdmfgs,
        hdmfps: hdmfps,
        wtax: wtax,
        sss: sss,
      },
    });

    return { success: "Mandatory Deductions has been added successfully!" };
  } catch (error) {
    return { error: "Something went wrong, try again later." };
  }
};
