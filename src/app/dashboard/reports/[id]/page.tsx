import React from "react";
import UploadButton from "@/components/UploadButton";
import DataTable from "@/components/tables/MandatoryDeductionsTable";
import { GridColDef } from "@mui/x-data-grid";
import { singleReportData } from "@/lib/data";
import ViewReport from "@/components/tables/ViewReport";
import { getReportById } from "@/data/report";
import DynamicHeader from "@/components/ui/DynamicHeader";

const SingleReportPage = async ({ params }: { params: any }) => {
  const slug = (await params) as any;
  const report = (await getReportById(slug.id)) as any;

  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <DynamicHeader label={report.name} />
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadButton />
        </div>
      </div>
      <div className="mt-4">
        <ViewReport reports={report.items} name={report.name} />
      </div>
    </div>
  );
};

export default SingleReportPage;
