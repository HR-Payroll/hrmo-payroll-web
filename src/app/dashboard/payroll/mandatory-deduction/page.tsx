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
    <div className="container">
      <header className="absolute top-4 -ml-4">
        <PageInfo
          title="Payroll Register"
          info="Manage your employee's mandatory deductions for the payroll register in this page."
        />
      </header>

      <main className="space-y-4">
        <section className="flex flex-col md:flex-row items-center justify-between gap-4">
          <TableSearch />
          <div className="flex flex-col md:flex-row items-center gap-4">
            <TableFilters departments={departments} />
            <div className="flex items-center gap-4">
              <UploadButton />
              <AddButton table="deduction" title="Add Deduction" />
            </div>
          </div>
        </section>

        <section>
          <MandatoryDeductionsTable
            employees={employees}
            departments={departments}
            reload={reload}
          />
        </section>
      </main>
    </div>
  );
};

export default MandatoryDeductions;
