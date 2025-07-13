import React from "react";
import { revalidatePath } from "next/cache";
import { getAllRate } from "@/data/compensation-rate";
import { getAllEmployee } from "@/data/employee";
import { getAllDepartment } from "@/data/department";
import PageInfo from "@/components/PageInfo";
import TableSearch from "@/components/TableSearch";
import TableFilters from "@/components/TableFilters";
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
    <div className="container">
      <header className="absolute top-4 -ml-4">
        <PageInfo
          title="Payroll Register"
          info="Manage your employee's compensation rate for the payroll register in this page."
        />
      </header>

      <main className="space-y-4">
        <section className="flex flex-col md:flex-row items-center justify-between gap-4">
          <TableSearch />
          <div className="flex flex-col md:flex-row items-center gap-4">
            <TableFilters departments={departments} />
            <UploadButton />
          </div>
        </section>

        <section>
          <CompensationRateTable
            departments={departments}
            employees={employee}
            rates={rates}
            reload={reload}
          />
        </section>
      </main>
    </div>
  );
};

export default CompensationRate;
