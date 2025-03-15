import React from "react";
import { revalidatePath } from "next/cache";
import { getAllEmployee } from "@/data/employee";
import { getAllDepartment } from "@/data/department";
import AddButton from "@/components/AddButton";
import UploadButton from "@/components/UploadButton";
import EmployeesTable from "@/components/tables/EmployeesTable";

const Employees = async () => {
  const departments = (await getAllDepartment()) as any;
  const employees = (await getAllEmployee()) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/employees");
  }

  return (
    <div className="w-full bg-white rounded-md border-2 border-[#ECEEF6] gap-y-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="w-full flex flex-row items-center justify-between">
        <h1 className="hidden sm:block text-base font-semibold">Employees</h1>
        <div className="flex flex-row gap-4 cursor-pointer">
          <UploadButton />
          <AddButton
            data={departments}
            table="employee"
            title="Add Employee"
            reload={reload}
          />
        </div>
      </div>
      <div className="w-full mt-4">
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
