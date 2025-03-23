import React from "react";
import UploadButton from "@/components/UploadButton";
import DataTable from "@/components/tables/MandatoryDeductionsTable";
import { GridColDef } from "@mui/x-data-grid";
import { singleReportData } from "@/lib/data";
import ViewReport from "@/components/tables/ViewReport";
import { getReportById } from "@/data/report";
import DynamicHeader from "@/components/ui/DynamicHeader";

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
    <div className="flex-1 rounded-md bg-white border-2 border-[var(--border)] gap-4 m-4 mt-10 sm:mt-0 p-4 text-[var(--text)]">
      <div className="flex flex-row items-center justify-between gap-4">
        <DynamicHeader label={report ? report.name : "N/A"} />
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadButton />
        </div>
      </div>
      <div className="mt-4">
        <ViewReport
          reports={report ? report.items : []}
          name={report ? report.name : "N/A"}
        />
      </div>
    </div>
  );
};

export default SingleReportPage;
