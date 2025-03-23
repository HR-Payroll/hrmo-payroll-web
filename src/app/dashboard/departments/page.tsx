import React from "react";
import { revalidatePath } from "next/cache";
import { getPaginatedDepartment } from "@/data/department";
import PageInfo from "@/components/PageInfo";
import TableSearch from "@/components/TableSearch";
import AddButton from "@/components/AddButton";
import DepartmentTable from "@/components/tables/DepartmentTable";
import UploadDepartments from "@/components/Uploads/UploadDepartments";

const Departments = async (props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}) => {
  const params = await props.searchParams;
  const search = params?.search;
  const page = params?.page;
  const limit = params?.limit;

  let isLoading = true;
  const departments = (await getPaginatedDepartment(
    search,
    Number(page || 0),
    Number(limit || 10)
  )) as any;
  isLoading = false;

  async function reload() {
    "use server";

    revalidatePath("/dashboard/departments");
  }

  return (
    <div className="w-full bg-white rounded-md border-2 border-[var(--border)] text-[var(--text)] p-4">
      <div className="absolute top-4 -ml-4">
        <PageInfo
          title="Departments"
          info="Manage your company's departments in this page. You can add, edit, or delete department details here."
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-y-4">
        <div>
          <TableSearch />
        </div>
        <div className="flex flex-row items-center gap-4 cursor-pointer">
          <UploadDepartments reload={reload} />
          <AddButton
            table="department"
            title="Add Department"
            reload={reload}
          />
        </div>
      </div>
      <div className="w-full mt-4">
        <DepartmentTable
          departments={departments.items}
          reload={reload}
          isLoading={isLoading}
          limit={departments.pageSize}
          rowCount={departments.pageRange}
          page={departments.page}
        />
      </div>
    </div>
  );
};

export default Departments;
