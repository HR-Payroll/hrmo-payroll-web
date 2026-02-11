import React from "react";
import { revalidatePath } from "next/cache";
import { getPaginatedDepartment } from "@/data/department";
import PageInfo from "@/components/PageInfo";
import TableSearch from "@/components/TableSearch";
import AddButton from "@/components/AddButton";
import DepartmentTable from "@/components/tables/DepartmentTable";
import UploadDepartments from "@/components/Uploads/UploadDepartments";
import TableFilters from "@/components/TableFilters";

const Departments = async (props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    category?: string;
  }>;
}) => {
  const params = await props.searchParams;
  const { search, page, limit, category } = params as any;

  let isLoading = true;
  const departments = (await getPaginatedDepartment(
    search,
    Number(page || 0),
    Number(limit || 10),
    category,
  )) as any;
  isLoading = false;

  async function reload() {
    "use server";

    revalidatePath("/dashboard/departments");
  }

  return (
    <div className="container">
      <header className="absolute top-4 -ml-4">
        <PageInfo
          title="Departments"
          info="Manage your company's departments in this page. You can add, edit, or delete department details here."
        />
      </header>

      <main className="space-y-4">
        <section className="flex flex-col md:flex-row items-center justify-between gap-4">
          <TableSearch />
          <div className="flex items-center gap-4">
            <TableFilters category_only />
            <UploadDepartments reload={reload} />
            <AddButton
              table="department"
              title="Add Department"
              reload={reload}
            />
          </div>
        </section>

        <section>
          <DepartmentTable
            departments={departments.items}
            reload={reload}
            isLoading={isLoading}
            limit={departments.pageSize}
            rowCount={departments.pageRange}
            page={departments.page}
          />
        </section>
      </main>
    </div>
  );
};

export default Departments;
