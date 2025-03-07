import React from "react";
import UploadButton from "@/components/UploadButton";
import AddButton from "@/components/AddButton";
import DataTable from "@/components/tables/DataTable";
import { GridColDef } from "@mui/x-data-grid";

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
    field: "rate",
    headerName: "Rate",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "type",
    headerName: "Type",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
    type: "singleSelect",
    valueOptions: ["Daily", "Weekly", "Bi-weekly", "Monthly", "Contractual"],
    editable: true,
  },
];

const CompensationRate = () => {
  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="hidden sm:block text-base font-semibold text-[#333333]">
          Compensation Rate
        </h1>
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadButton />
          <AddButton table="rate" title="Add Rate" />
        </div>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} rows={[]} />
      </div>
    </div>
  );
};

export default CompensationRate;
