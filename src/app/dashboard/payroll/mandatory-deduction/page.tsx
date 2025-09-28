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
import { getPaginatedMDeduction } from "@/data/mandatory-deduction";

const MandatoryDeductions = async (props: {
  searchParams?: Promise<{
    search?: string;
    category?: string;
    department?: string;
    page?: string;
    limit?: string;
  }>;
}) => {
  const params = await props.searchParams;
  const { search, page, limit, category, department } = params as any;

  const departments = (await getAllDepartment()) as any;
  const deductions = (await getPaginatedMDeduction(
    search,
    Number(page || 0),
    Number(limit || 10),
    category,
    department
  )) as any;

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
            deductions={deductions.items}
            reload={reload}
            limit={deductions.pageSize}
            rowCount={deductions.pageRange}
            page={deductions.page}
          />
        </section>
      </main>
    </div>
  );
};

export default MandatoryDeductions;
