import React from "react";
import { revalidatePath } from "next/cache";
import { getPaginatedReport } from "@/data/report";
import { getAllEmployee } from "@/data/employee";
import { getAllDepartment } from "@/data/department";
import PageInfo from "@/components/PageInfo";
import TableSearch from "@/components/TableSearch";
import DownloadButton from "@/components/DownloadButton";
import UploadButton from "@/components/UploadButton";
import DateFilter from "@/components/DateFilter";
import TableFilters from "@/components/TableFilters";
import ReportTable from "@/components/tables/ReportTable";

const Reports = async (props: {
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
  const employees = (await getAllEmployee()) as any;

  const params = await props.searchParams;
  const search = params?.search;
  const page = params?.page;
  const limit = params?.limit;
  const from = params?.from;
  const to = params?.to;
  const category = params?.category;
  const department = params?.department;

  const currentDate = new Date();
  const day1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const day15 = new Date(currentDate.getFullYear(), currentDate.getMonth(), 15);
  const dateFrom = from
    ? new Date(from)
    : currentDate.getDate() >= 15
    ? day15
    : day1;
  const dateTo = to ? new Date(to) : currentDate;

  const reports = (await getPaginatedReport(
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
    revalidatePath("/dashboard/reports");
  }

  return (
    <div className="w-full bg-white rounded-md border-2 border-[var(--border)] text-[var(--text)] p-4">
      <div className="absolute top-4 -ml-4">
        <PageInfo
          title="Reports"
          info="Manage your company's employee reports in this page. You can view employee daily time record here."
        />
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-y-4">
          <div>
            <TableSearch />
          </div>
          <div className="flex flex-row gap-x-4">
            <UploadButton />
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
        <ReportTable
          employees={employees}
          departments={departments}
          reload={reload}
          reports={reports.items}
          from={dateFrom}
          to={dateTo}
          limit={reports.pageSize}
          rowCount={reports.pageRange}
          page={reports.page}
        />
      </div>
    </div>
  );
};

export default Reports;
