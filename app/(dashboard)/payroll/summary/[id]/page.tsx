import React from "react";
import UploadButton from "@/app/components/UploadButton";
import DataTable from "@/app/components/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { singleSummaryData } from "@/app/lib/data";

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
    field: "salary",
    headerName: "Gross Salary",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "deductions",
    headerName: "Late Deductions",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "earnings",
    headerName: "Total Earnings",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
];

const SingleSummaryPage = () => {
  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-base font-semibold text-[#333333]">Reports</h1>
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadButton />
        </div>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} rows={singleSummaryData} />
      </div>
    </div>
  );
};

export default SingleSummaryPage;
