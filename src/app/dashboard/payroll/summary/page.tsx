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
import { getPaginatedSummary } from "@/data/payroll";
import { dateQuery } from "@/utils/dateFormatter";
import DownloadSummary from "@/components/Downloads/DownloadSummary";

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

  const params = await props.searchParams;
  const { search, page, limit, from, to } = params as any;

  const { dateFrom, dateTo } = dateQuery(from, to);

  const summary = (await getPaginatedSummary(
    dateFrom,
    dateTo,
    search,
    Number(page || 0),
    Number(limit || 10)
  )) as any;

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
            <DownloadSummary />
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
          summary={summary.items || []}
          departments={departments}
          reload={reload}
          from={dateFrom}
          to={dateTo}
          limit={summary.pageSize}
          rowCount={summary.pageRange}
          page={summary.page}
        />
      </div>
    </div>
  );
};

export default Summary;
