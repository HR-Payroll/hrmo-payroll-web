"use server";
import { prisma } from "../../prisma/prisma";

export const updateLoan = async (
  id: number,
  payload: {
    name?: string;
    department?: any;
    mplhdmf?: number;
    gfal?: number;
    landbank?: number;
    cb?: number;
    eml?: number;
    mplgsis?: number;
    tagum?: number;
    ucpb?: number;
    mpllite?: number;
    sb?: number;
  }
) => {
  try {
    await prisma.employee.update({
      where: { id },
      data: { ...payload },
    });

    return {
      success:
        "Employee Loans & Other Deductions has been successfully updated!",
    };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong, please try again later." };
  }
};
