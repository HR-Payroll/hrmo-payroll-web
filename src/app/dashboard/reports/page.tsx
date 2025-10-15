import React from "react";
import { revalidatePath } from "next/cache";
import { getPaginatedReport, getReportByDepartment } from "@/data/report";
import { getAllEmployee } from "@/data/employee";
import { getAllDepartment } from "@/data/department";
import PageInfo from "@/components/PageInfo";
import TableSearch from "@/components/TableSearch";
import DateFilter from "@/components/DateFilter";
import TableFilters from "@/components/TableFilters";
import ReportTable from "@/components/tables/ReportTable";
import { dateQuery } from "@/utils/dateFormatter";
import UploadReports from "@/components/Uploads/UploadReports";
import DownloadMultipleReports from "@/components/Downloads/DownloadMultipleReports";

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
  const { search, page, limit, from, to, category, department } = params as any;

  const { dateFrom, dateTo } = dateQuery(from, to);

  const reports = (await getPaginatedReport(
    dateFrom,
    dateTo,
    search,
    Number(page || 0),
    Number(limit || 10),
    category,
    department
  )) as any;

  let allReports = [];
  if (category && department) {
    allReports = (await getReportByDepartment(dateFrom, dateTo, {
      category,
      department: Number(department),
    })) as any;

  }

  async function reload() {
    "use server";
    revalidatePath("/dashboard/reports");
  }

  return (
    <div className="container">
      <header className="absolute top-4 -ml-4">
        <PageInfo
          title="Reports"
          info="Manage your company's employee reports in this page. You can view employee daily time record here."
        />
      </header>

      <main className="space-y-4">
        <section className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <TableSearch />
            <div className="flex gap-4">
              <UploadReports />
              <DownloadMultipleReports
                reports={allReports}
                filter={{ from: dateFrom, to: dateTo }}
                disable={!allReports || allReports.length === 0}
              />
            </div>
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
        </section>
      </main>
    </div>
  );
};

export default Reports;
