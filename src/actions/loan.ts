"use server";
import { LoanSchema } from "@/lib/zod";
import { z } from "zod";
import { prisma } from "../../prisma/prisma";

export const createLoan = async (
  data: z.infer<typeof LoanSchema>
) => {
  const validateData = LoanSchema.parse(data);

  if (!validateData) {
    return { error: "Invalid input fields" };
  }

  const { category, department, employee, mplhdmf, gfal, landbank, cb, eml, mplgsis, tagum, ucpb, mpllite, sb } = validateData;

  try {
    await prisma.loan.create({
      data: { category: category, department: department, employee: employee, mplhdmf: mplhdmf, gfal: gfal, landbank: landbank, cb: cb, eml: eml, mplgsis: mplgsis, tagum: tagum, ucpb: ucpb, mpllite: mpllite, sb: sb },
    });

    return { success: "Loan and Other Deductions has been added successfully!" };
  } catch (error) {
    return { error: "Something went wrong, try again later." };
  }
};
