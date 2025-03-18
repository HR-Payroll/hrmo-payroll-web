import React from "react";
import UploadButton from "@/components/UploadButton";
import DataTable from "@/components/tables/MandatoryDeductionsTable";
import { GridColDef } from "@mui/x-data-grid";
import { singleReportData } from "@/lib/data";

const columns: GridColDef[] = [
  {
    field: "date",
    headerName: "Date",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "employee",
    headerName: "Employee Name",
    headerClassName: "custom-header",
    flex: 1.5,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "timeInAM",
    headerName: "Time In",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "timeOutAM",
    headerName: "Time Out",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "timeInPM",
    headerName: "Time In",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "timeOutPM",
    headerName: "Time Out",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
];

const SingleReportPage = () => {
  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-base font-semibold text-[#333333]">
          Daily Time Record (CAILING, CHRISTY)
        </h1>
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadButton />
        </div>
      </div>
      <div className="mt-4"></div>
    </div>
  );
};

export default SingleReportPage;
