"use server";
import { prisma } from "../../prisma/prisma";

export const updateMandatory = async (
  id: string,
  payload: {
    name?: string;
    department?: any;
    gsisgs?: number;
    ec?: number;
    gsisps?: number;
    phic?: number;
    hdmfgs?: number;
    hdmfps?: number;
    wtax?: number;
    sss?: number;
  }
) => {
  try {
    await prisma.employee.update({
      where: { id },
      data: { ...payload },
    });

    return { success: "Employee Mandatory Deductions has been successfully updated!" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong, please try again later." };
  }
};
