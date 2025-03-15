import React from "react";
import UploadButton from "@/components/UploadButton";
import AddButton from "@/components/AddButton";
import DeptTable from "@/components/tables/DeptTable";
import { getAllDepartment } from "@/data/department";
import { revalidatePath } from "next/cache";

const Departments = async () => {
  const departments = (await getAllDepartment()) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/departments");
  }

  return (
    <div className="w-full rounded-md bg-white border-2 border-[#ECEEF6] gap-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="w-full flex flex-row items-center justify-between gap-4">
        <h1 className="hidden sm:block text-base font-semibold">Departments</h1>
        <div className="flex flex-row gap-4 cursor-pointer">
          <UploadButton reload={reload} />
          <AddButton
            table="department"
            title="Add Department"
            reload={reload}
          />
        </div>
      </div>
      <div className="w-full mt-4">
        <DeptTable data={departments} reload={reload} />
      </div>
    </div>
  );
};

export default Departments;
