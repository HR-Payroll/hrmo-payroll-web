import React from "react";
import PageInfo from "@/components/PageInfo";
import DynamicHeader from "@/components/ui/DynamicHeader";
import DateFilter from "@/components/DateFilter";
import ViewReport from "@/components/tables/ViewReport";
import { getReportById } from "@/data/report";
import { dateQuery } from "@/utils/dateFormatter";
import DownloadSingleReport from "@/components/Downloads/DownloadSingleReport";
import BackButton from "@/components/ui/BackButton";

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
            <BackButton to={`/dashboard/reports`} />
            <DynamicHeader label={report ? report.employee.name : "N/A"} />
          </div>
          <div className="flex items-center justify-between">
            <DateFilter from={dateFrom} />
            <DownloadSingleReport
              reports={report ? report.items : []}
              employee={report ? report.employee : null}
              numDays={report ? report.totalDays : 0}
              totalLate={report ? report.totalLate : 0}
              filter={{ from: dateFrom, to: dateTo }}
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
