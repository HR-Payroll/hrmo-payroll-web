import React from "react";
import UploadButton from "@/components/UploadButton";
import ViewTable from "@/components/tables/ViewTable";
import { GridColDef } from "@mui/x-data-grid";
import { reportData } from "@/lib/data";

const columns: GridColDef[] = [
  {
    field: "employeeId",
    headerName: "ID Number",
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
    field: "department",
    headerName: "Department",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "category",
    headerName: "Category",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "numDays",
    headerName: "Number of Days",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "minsLate",
    headerName: "Minutes Late",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
];

const Reports = () => {
  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-base font-semibold text-[#333333]">Reports</h1>
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadButton />
        </div>
      </div>
      <div className="mt-4">
        <ViewTable columns={columns} rows={reportData} slug="reports" />
      </div>
    </div>
  );
};

export default Reports;
