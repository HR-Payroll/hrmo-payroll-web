import React from "react";
import { revalidatePath } from "next/cache";
import { getAllDepartment } from "@/data/department";
import AddButton from "@/components/AddButton";
import UploadButton from "@/components/UploadButton";
import DepartmentTable from "@/components/tables/DepartmentTable";

const Departments = async () => {
  const departments = (await getAllDepartment()) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/departments");
  }

  return (
    <div className="w-full bg-white rounded-md border-2 border-[#ECEEF6] gap-y-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="w-full flex flex-row items-center justify-between">
        <h1 className="hidden sm:block text-base font-semibold">Departments</h1>
        <div className="flex flex-row gap-4 cursor-pointer">
          <UploadButton />
          <AddButton
            table="department"
            title="Add Department"
            reload={reload}
          />
        </div>
      </div>
      <div className="w-full mt-4">
        <DepartmentTable departments={departments} reload={reload} />
      </div>
    </div>
  );
};

export default Departments;
