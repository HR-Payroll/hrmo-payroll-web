import React from "react";
import UploadButton from "@/components/UploadButton";
import AddButton from "@/components/AddButton";
import DeptTable from "@/components/tables/DeptTable";
import { GridColDef } from "@mui/x-data-grid";
import { departmentData } from "@/lib/data";
import { getAllDepartment } from "@/data/department";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Department Name",
    headerClassName: "custom-header",
    flex: 1.5,
    align: "center",
    headerAlign: "center",
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
  {
    field: "totalEmployees",
    headerName: "Total Employees",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
];

const Departments = async () => {
  const departments = (await getAllDepartment()) as any;

  console.log(departments);
  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-base font-medium text-[#333333]">Departments</h1>
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadButton />
          <AddButton table="department" title="Add Department" />
        </div>
      </div>
      <div className="mt-4">
        <DeptTable columns={columns} rows={departments} />
      </div>
    </div>
  );
};

export default Departments;
