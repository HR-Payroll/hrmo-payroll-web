import React from "react";
import Link from "next/link";
import PageInfo from "@/components/PageInfo";
import DynamicHeader from "@/components/ui/DynamicHeader";
import DateFilter from "@/components/DateFilter";
import ViewReport from "@/components/tables/ViewReport";
import { getReportById } from "@/data/report";
import { MdArrowBackIosNew } from "react-icons/md";
import { dateQuery } from "@/utils/dateFormatter";
import DownloadSingleReport from "@/components/Downloads/DownloadSingleReport";

const SingleReportPage = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: Promise<{
    from?: string;
    to?: string;
  }>;
}) => {
  const slug = (await params) as any;
  const query = (await searchParams) as any;
  const id = slug.id;
  const from = query.from;
  const to = query.to;

  const { dateFrom, dateTo } = dateQuery(from, to);

  const report = (await getReportById(id, dateFrom, dateTo)) as any;

  return (
    <div className="card">
      <header className="absolute top-4 -ml-4">
        <PageInfo
          title="Reports"
          info="Manage your company’s employee reports in this page. You can view employee date and time records here."
        />
      </header>

      <main className="space-y-4">
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/reports`}
              className="rounded-full bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] p-2 cursor-pointer"
            >
              <MdArrowBackIosNew size={12} />
            </Link>
            <DynamicHeader
              label={
                report
                  ? report.name.ref
                    ? report.name.name
                    : `${report.name.name} (no ref)`
                  : "N/A"
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <DateFilter from={dateFrom} />
            <DownloadSingleReport
              reports={report ? report.items : []}
              employee={report ? report.employee : null}
              numDays={report ? report.totalDays : 0}
            />
          </div>
        </section>

        <section>
          <ViewReport
            reports={report ? report.items : []}
            name={report ? report.name : "N/A"}
          />
        </section>
      </main>
    </div>
  );
};

export default SingleReportPage;
