import React from "react";
import UploadButton from "@/components/UploadButton";
import DataTable from "@/components/tables/MandatoryDeductionsTable";
import { GridColDef } from "@mui/x-data-grid";
import { singleSummaryData } from "@/lib/data";
import PageInfo from "@/components/PageInfo";
import Link from "next/link";
import { MdArrowBackIosNew } from "react-icons/md";
import DynamicHeader from "@/components/ui/DynamicHeader";
import DateFilter from "@/components/DateFilter";
import DownloadButton from "@/components/DownloadButton";
import ViewSummary from "@/components/tables/ViewSummary";
import { getSummaryById } from "@/data/payroll";
import { dateQuery } from "@/utils/dateFormatter";

const SingleSummaryPage = async ({
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

  const summary = (await getSummaryById(id, dateFrom, dateTo)) as any;

  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[var(--border)] gap-4 m-4 mt-10 sm:mt-0 p-4 text-[var(--text)]">
      <div className="absolute top-4 -ml-4">
        <PageInfo
          title="Summary"
          info="Manage your company’s employee reports in this page. You can view employee date and time records here."
        />
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row items-center gap-2">
          <Link
            href={`/dashboard/payroll/summary`}
            className="rounded-full bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] p-2 cursor-pointer"
          >
            <MdArrowBackIosNew size={12} />
          </Link>
          <DynamicHeader
            label={
              summary
                ? summary.name.ref
                  ? summary.name.name
                  : `${summary.name.name} (no ref)`
                : "N/A"
            }
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <DateFilter from={dateFrom} />
          <DownloadButton />
        </div>
      </div>
      <div className="mt-4">
        <ViewSummary summary={summary.items} />
      </div>
    </div>
  );
};

export default SingleSummaryPage;
