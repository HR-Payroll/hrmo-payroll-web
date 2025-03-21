import React from "react";
import UploadButton from "@/components/UploadButton";
import ReportTable from "@/components/tables/ReportTable";
import { GridColDef } from "@mui/x-data-grid";
import { reportData } from "@/lib/data";
import UploadReports from "@/components/Uploads/UploadReports";
import { getAllReport } from "@/data/report";
import { revalidatePath } from "next/cache";

const Reports = async () => {
  const reports = (await getAllReport()) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/reports");
  }

  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="hidden sm:block text-base font-semibold">Reports</h1>
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadReports reload={reload} />
        </div>
      </div>
      <div className="mt-4">
        <ReportTable reports={reports} />
      </div>
    </div>
  );
};

export default Reports;
