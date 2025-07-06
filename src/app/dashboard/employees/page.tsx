import React from "react";
import { revalidatePath } from "next/cache";
import { getPaginatedEmployee } from "@/data/employee";
import { getAllDepartment } from "@/data/department";
import PageInfo from "@/components/PageInfo";
import TableSearch from "@/components/TableSearch";
import TableFilters from "@/components/TableFilters";
import AddButton from "@/components/AddButton";
import EmployeesTable from "@/components/tables/EmployeesTable";
import UploadEmployees from "@/components/Uploads/UploadEmployees";
import { getAllSchedules } from "@/data/schedule";

const Employees = async (props: {
  searchParams?: Promise<{
    search?: string;
    category?: string;
    department?: string;
    page?: string;
    limit?: string;
  }>;
}) => {
  const params = await props.searchParams;
  const { search, page, limit, category, department } = params as any;

  const departments = (await getAllDepartment()) as any;
  const schedules = (await getAllSchedules()) as any;
  const employees = (await getPaginatedEmployee(
    search,
    Number(page || 0),
    Number(limit || 10),
    category,
    department
  )) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/employees");
  }

  return (
    <div className="w-full bg-white rounded-md border-2 border-[var(--border)] text-[var(--text)] p-4">
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
            <UploadEmployees departments={departments} reload={reload} />
            <AddButton
              data={departments}
              schedules={schedules}
              table="employee"
              title="Add Employee"
              reload={reload}
            />
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <EmployeesTable
          employees={employees.items}
          departments={departments}
          schedules={schedules}
          reload={reload}
          limit={employees.pageSize}
          rowCount={employees.pageRange}
          page={employees.page}
        />
      </div>
    </div>
  );
};

export default Employees;
