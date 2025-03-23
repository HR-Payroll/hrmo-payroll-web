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
import { getAllReport, getPaginatedReport } from "@/data/report";

const Summary = async (props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    from?: string;
    to?: string;
  }>;
}) => {
  const departments = (await getAllDepartment()) as any;
  const employees = (await getAllEmployee()) as any;

  const params = await props.searchParams;
  const search = params?.search;
  const page = params?.page;
  const limit = params?.limit;
  const from = params?.from;
  const to = params?.to;

  const currentDate = new Date();
  const day1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const day15 = new Date(currentDate.getFullYear(), currentDate.getMonth(), 15);
  const dateFrom = from
    ? new Date(from)
    : currentDate.getDate() >= 15
    ? day15
    : day1;
  const dateTo = to ? new Date(to) : currentDate;

  const reports = (await getPaginatedReport(dateFrom, dateTo, search)) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/payroll/summary");
  }

  return (
    <div className="w-full bg-white rounded-md border-2 border-[var(--border)] text-[var(--text)] p-4">
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
          <DateFilter from={dateFrom} />
          <div className="flex flex-col sm:flex-row items-center justify-center">
            <span className="hidden sm:block text-sm font-medium pr-4">
              Filters
            </span>
            <TableFilters departments={departments} />
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <SummaryTable
          employees={employees}
          departments={departments}
          reload={reload}
          reports={reports}
          from={dateFrom}
          to={dateTo}
        />
      </div>
    </div>
  );
};

export default Summary;
