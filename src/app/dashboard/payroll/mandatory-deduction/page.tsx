import React from "react";
import { revalidatePath } from "next/cache";
import { getAllEmployee } from "@/data/employee";
import { getAllDepartment } from "@/data/department";
import PageInfo from "@/components/PageInfo";
import TableSearch from "@/components/TableSearch";
import TableFilters from "@/components/TableFilters";
import UploadButton from "@/components/UploadButton";
import AddButton from "@/components/AddButton";
import MandatoryDeductionsTable from "@/components/tables/MandatoryDeductionsTable";

const MandatoryDeductions = async () => {
  const departments = (await getAllDepartment()) as any;
  const employees = (await getAllEmployee()) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/payroll/mandatory-deduction");
  }
  return (
    <div className="w-full bg-white rounded-md border-2 border-[#ECEEF6] p-4 text-[#333333]">
      <div className="absolute top-4 -ml-4">
        <PageInfo
          title="Payroll Register"
          info="Manage your employee's mandatory deductions for the payroll register in this page."
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-y-4">
        <div>
          <TableSearch />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 cursor-pointer">
          <TableFilters departments={departments} />
          <div className="flex flex-row items-center justify-center gap-4 cursor-pointer">
            <UploadButton />
            <AddButton table="deduction" title="Add Deductions" />
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <MandatoryDeductionsTable
          employees={employees}
          departments={departments}
          reload={reload}
        />
      </div>
    </div>
  );
};

export default MandatoryDeductions;
