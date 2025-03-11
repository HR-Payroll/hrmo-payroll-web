import React from "react";
import UploadButton from "@/components/UploadButton";
import AddButton from "@/components/AddButton";
import EmployeesTable from "@/components/tables/EmployeesTable";
import { getAllDepartment } from "@/data/department";
import { getAllEmployee } from "@/data/employee";
import { revalidatePath } from "next/cache";

const Employees = async () => {
  const departments = (await getAllDepartment()) as any;
  const employees = (await getAllEmployee()) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/employees");
  }

  return (
    <div className="flex-1 overflow-x-auto rounded-md bg-white border-2 border-[#ECEEF6] gap-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="hidden sm:block text-base font-semibold">Employees</h1>
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
        <EmployeesTable
          employees={employees}
          departments={departments}
          reload={reload}
        />
      </div>
    </div>
  );
};

export default Employees;
