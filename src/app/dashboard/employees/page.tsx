import React from "react";
import { revalidatePath } from "next/cache";
import { getAllEmployee } from "@/data/employee";
import { getAllDepartment } from "@/data/department";
import PageInfo from "@/components/PageInfo";
import TableSearch from "@/components/TableSearch";
import TableFilters from "@/components/TableFilters";
import UploadButton from "@/components/UploadButton";
import AddButton from "@/components/AddButton";
import EmployeesTable from "@/components/tables/EmployeesTable";

const Employees = async () => {
  const departments = (await getAllDepartment()) as any;
  const employees = (await getAllEmployee()) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/employees");
  }

  return (
    <div className="w-full bg-white rounded-md border-2 border-[#ECEEF6] p-4 text-[#333333]">
      <div className="absolute top-4 -ml-4">
        <PageInfo
          title="Employees"
          info="Manage your company's employees in this page. You can add, edit, or delete employee details here."
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-y-4">
        <div>
          <TableSearch />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 cursor-pointer">
          <TableFilters departments={departments} />
          <div className="flex flex-row items-center justify-center gap-4 cursor-pointer">
            <UploadButton />
            <AddButton
              data={departments}
              table="employee"
              title="Add Employee"
              reload={reload}
              departments={departments}
              employees={employees}
            />
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <EmployeesTable
          departments={departments}
          employees={employees}
          reload={reload}
        />
      </div>
    </div>
  );
};

export default Employees;
