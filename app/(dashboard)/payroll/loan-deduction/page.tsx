import React from "react";
import UploadButton from "@/app/components/UploadButton";
import AddButton from "@/app/components/AddButton";
import DataTable from "@/app/components/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { loanDeducData } from "@/app/lib/data";

const columns: GridColDef[] = [
  {
    field: "employee",
    headerName: "Employee Name",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "department",
    headerName: "Department",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "mplhdmf",
    headerName: "MPL-HDMF",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "gfal",
    headerName: "GFAL",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "landbank",
    headerName: "Landbank",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "cb",
    headerName: "CB",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "eml",
    headerName: "EML",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "mplgsis",
    headerName: "MPL-GSIS",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "tagum",
    headerName: "Tagum Bank",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "ucpb",
    headerName: "UCPB",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "mpllite",
    headerName: "MPL-Lite",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "sb",
    headerName: "SB",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
];

const LoanDeductions = () => {
  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-base font-semibold text-[#333333]">
          Loan Deductions
        </h1>
        <div className="flex flex-row items-center justify-end gap-2 sm:gap-4 cursor-pointer">
          <UploadButton />
          <AddButton table="loan" title="Add Deductions" />
        </div>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} rows={loanDeducData} />
      </div>
    </div>
  );
};

export default LoanDeductions;
