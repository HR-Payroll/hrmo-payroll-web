import React from "react";
import UploadButton from "@/app/components/UploadButton";
import AddButton from "@/app/components/AddButton";
import DataTable from "@/app/components/tables/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { employeeData } from "@/app/lib/data";

const columns: GridColDef[] = [
  {
    field: "employeeId",
    headerName: "ID Number",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "employee",
    headerName: "Employee Name",
    headerClassName: "custom-header",
    flex: 1.5,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "department",
    headerName: "Department",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
    type: "singleSelect",
    valueOptions: [
      "Accounting Office",
      "Assessor's Office",
      "Consultant's Office",
      "Contractual 20%",
      "Dept. of Agriculture",
    ],
    editable: true,
  },
  {
    field: "category",
    headerName: "Category",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
    type: "singleSelect",
    valueOptions: ["Regular", "Casual", "Job Order"],
    editable: true,
  },
];

const Employees = () => {
  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-base font-semibold text-[#333333]">Employees</h1>
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadButton />
          <AddButton table="employee" title="Add Employee" />
        </div>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} rows={employeeData} />
      </div>
    </div>
  );
};

export default Employees;
