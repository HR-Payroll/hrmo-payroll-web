import React from "react";
import UploadButton from "@/components/UploadButton";
import AddButton from "@/components/AddButton";
import DataTable from "@/components/tables/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { employeeData } from "@/lib/data";
import { getAllDepartment } from "@/data/department";
import { getAllEmployee } from "@/data/employee";

const columns: GridColDef[] = [
  {
    field: "recordNo",
    headerName: "ID Number",
    headerClassName: "custom-header",
    flex: 1,
    align: "center",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "name",
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

const Employees = async () => {
  const departments = await getAllDepartment();
  const employees = (await getAllEmployee()) as any;

  console.log(employees);
  return (
    <div className="flex-1 overflow-x-auto rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-base font-semibold text-[#333333]">Employees</h1>
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadButton />
          <AddButton data={departments} table="employee" title="Add Employee" />
        </div>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} rows={employees} />
      </div>
    </div>
  );
};

export default Employees;
