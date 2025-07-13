import React from "react";
import { revalidatePath } from "next/cache";
import { getAllDepartment } from "@/data/department";
import PageInfo from "@/components/PageInfo";
import TableSearch from "@/components/TableSearch";
import DateFilter from "@/components/DateFilter";
import TableFilters from "@/components/TableFilters";
import SummaryTable from "@/components/tables/SummaryTable";
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
    category?: string;
    department?: string;
  }>;
}) => {
  const departments = (await getAllDepartment()) as any;

  const params = await props.searchParams;
  const { search, page, limit, from, to, category, department } = params as any;

  const { dateFrom, dateTo } = dateQuery(from, to);

  const summary = (await getPaginatedSummary(
    dateFrom,
    dateTo,
    search,
    Number(page || 0),
    Number(limit || 10),
    category,
    department
  )) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/payroll/summary");
  }

  return (
    <div className="container">
      <header className="absolute top-4 -ml-4">
        <PageInfo
          title="Payroll Register"
          info="View the summary of the employee's payroll register here. You can download the file in excel format."
        />
      </header>

      <main className="space-y-4">
        <section className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <TableSearch />
            <DownloadSummary />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <DateFilter from={dateFrom} />
            <div className="flex flex-col md:flex-row items-center">
              <span className="hidden md:block text-sm font-medium pr-4">
                Filters
              </span>
              <TableFilters departments={departments} />
            </div>
          </div>
        </section>

        <section>
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
        </section>
      </main>
    </div>
  );
};

export default Summary;
