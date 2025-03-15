import React from "react";
import { revalidatePath } from "next/cache";
import { getAllEmployee } from "@/data/employee";
import { getAllDepartment } from "@/data/department";
import AddButton from "@/components/AddButton";
import UploadButton from "@/components/UploadButton";
import LoanDeductionsTable from "@/components/tables/LoanDeductionsTable";

const LoanDeductions = async () => {
  const departments = (await getAllDepartment()) as any;
  const employees = (await getAllEmployee()) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/payroll/loan-deduction");
  }
  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-base font-semibold">Loan and Other Deductions</h1>
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadButton />
          <AddButton table="deduction" title="Add Deductions" />
        </div>
      </div>
      <div className="mt-4">
        <LoanDeductionsTable
          employees={employees}
          departments={departments}
          reload={reload}
        />
      </div>
    </div>
  );
};

export default LoanDeductions;
