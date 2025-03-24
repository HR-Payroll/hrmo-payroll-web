import React from "react";
import Link from "next/link";
import PageInfo from "@/components/PageInfo";
import DynamicHeader from "@/components/ui/DynamicHeader";
import DateFilter from "@/components/DateFilter";
import DownloadButton from "@/components/DownloadButton";
import ViewReport from "@/components/tables/ViewReport";
import { getReportById } from "@/data/report";
import { MdArrowBackIosNew } from "react-icons/md";

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

  const currentDate = new Date();
  const day1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const day15 = new Date(currentDate.getFullYear(), currentDate.getMonth(), 15);
  const dateFrom = from
    ? new Date(from)
    : currentDate.getDate() >= 15
    ? day15
    : day1;
  const dateTo = to ? new Date(to) : currentDate;

  const report = (await getReportById(id, dateFrom, dateTo)) as any;

  return (
    <div className="flex-1 bg-white rounded-md border-2 border-[var(--border)] text-[var(--text)] p-4">
      <div className="absolute top-4 -ml-4">
        <PageInfo
          title="Reports"
          info="Manage your company’s employee reports in this page. You can view employee date and time records here."
        />
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row items-center gap-2">
          <Link
            href={`/dashboard/reports`}
            className="rounded-full bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] p-2 cursor-pointer"
          >
            <MdArrowBackIosNew size={12} />
          </Link>
          <DynamicHeader label={report ? report.name : "N/A"} />
        </div>
        <div className="flex flex-row items-center justify-between">
          <DateFilter from={dateFrom} />
          <DownloadButton />
        </div>
      </div>
      <div className="w-full mt-4">
        <ViewReport
          reports={report ? report.items : []}
          name={report ? report.name : "N/A"}
        />
      </div>
    </div>
  );
};

export default SingleReportPage;
