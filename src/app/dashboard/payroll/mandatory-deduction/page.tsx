import React from "react";
import UploadButton from "@/components/UploadButton";
import AddButton from "@/components/AddButton";
import DataTable from "@/components/tables/DataTable";
import { GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: "employee",
    headerName: "Employee Name",
    headerClassName: "custom-header",
    flex: 1.2,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "department",
    headerName: "Department",
    headerClassName: "custom-header",
    flex: 0.6,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "gsisgs",
    headerName: "GSIS(GS)",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "ec",
    headerName: "EC",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "gsisps",
    headerName: "GSIS(PS)",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "phic",
    headerName: "PHIC",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "hdmfgs",
    headerName: "HDMF(GS)",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "hdmfps",
    headerName: "HDMF(PS)",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "wtax",
    headerName: "WTax",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "sss",
    headerName: "SSS",
    headerClassName: "custom-header",
    flex: 0.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
];

const MandatoryDeductions = () => {
  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-base font-semibold">Mandatory Deductions</h1>
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadButton />
          <AddButton table="deduction" title="Add Deductions" />
        </div>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} rows={[]} />
      </div>
    </div>
  );
};

export default MandatoryDeductions;
