import React from "react";
import { revalidatePath } from "next/cache";
import { getAllEmployee } from "@/data/employee";
import { getAllDepartment } from "@/data/department";
import PageInfo from "@/components/PageInfo";
import TableSearch from "@/components/TableSearch";
import DownloadButton from "@/components/DownloadButton";
import DateFilter from "@/components/DateFilter";
import TableFilters from "@/components/TableFilters";
import SummaryTable from "@/components/tables/SummaryTable";

const Summary = async () => {
  const departments = (await getAllDepartment()) as any;
  const employees = (await getAllEmployee()) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/payroll/loan-deduction");
  }

  return (
    <div className="w-full bg-white rounded-md border-2 border-[#ECEEF6] gap-y-4 p-4 text-[#333333]">
      <div className="absolute top-4 -ml-4">
        <PageInfo
          title="Payroll Register"
          info="View the summary of the employee's payroll register here. You can download the file in excel format."
        />
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-y-4">
          <div>
            <TableSearch />
          </div>
          <div>
            <DownloadButton />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-y-4">
          <DateFilter />
          <div className="flex flex-col sm:flex-row items-center justify-center">
            <span className="hidden sm:block text-sm font-medium pr-4">
              Filters
            </span>
            <TableFilters />
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <SummaryTable
          employees={employees}
          departments={departments}
          reload={reload}
        />
      </div>
    </div>
  );
};

export default Summary;
