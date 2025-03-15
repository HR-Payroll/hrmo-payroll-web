import React from "react";
import { revalidatePath } from "next/cache";
import { getAllRate } from "@/data/compensation-rate";
import { getAllEmployee } from "@/data/employee";
import { getAllDepartment } from "@/data/department";
import AddButton from "@/components/AddButton";
import UploadButton from "@/components/UploadButton";
import CompensationRateTable from "@/components/tables/CompensationRateTable";

const CompensationRate = async () => {
  const departments = (await getAllDepartment()) as any;
  const employee = (await getAllEmployee()) as any;
  const rates = (await getAllRate()) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/payroll/compensation-rate");
  }
  return (
    <div className="w-full bg-white rounded-md border-2 border-[#ECEEF6] gap-y-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="w-full flex flex-row items-center justify-between">
        <h1 className="hidden sm:block text-base font-semibold">
          Compensation Rate
        </h1>
        <div className="flex flex-row gap-4 cursor-pointer">
          <UploadButton />
          <AddButton table="rate" title="Add Employee Rate" reload={reload} />
        </div>
      </div>
      <div className="w-full mt-4">
        <CompensationRateTable
          departments={departments}
          employees={employee}
          rates={rates}
          reload={reload}
        />
      </div>
    </div>
  );
};

export default CompensationRate;
