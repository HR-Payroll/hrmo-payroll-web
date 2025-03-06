import React from "react";
import UploadButton from "@/components/UploadButton";
import AddButton from "@/components/AddButton";
import DataTable from "@/components/tables/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { employeeData } from "@/lib/data";
import { getAllDepartment } from "@/data/department";
import { getAllEmployee } from "@/data/employee";
import EmployeesTable from "@/components/tables/EmployeesTable";
import { revalidatePath } from "next/cache";

const Employees = async () => {
  const departments = await getAllDepartment();
  const employees = (await getAllEmployee()) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/employees");
  }

  return (
    <div className="flex-1 overflow-x-auto rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-base font-semibold text-[#333333]">Employees</h1>
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadButton />
          <AddButton
            data={departments}
            table="employee"
            title="Add Employee"
            reload={reload}
          />
        </div>
      </div>
      <div className="mt-4">
        <EmployeesTable data={employees} reload={reload} />
      </div>
    </div>
  );
};

export default Employees;
