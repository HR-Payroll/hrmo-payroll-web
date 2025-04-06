import React from "react";
import PageInfo from "@/components/PageInfo";
import SettingsTable from "@/components/tables/SettingsTable";
import { getAllDepartment } from "@/data/department";

const SettingsPage = async () => {
  const departments = (await getAllDepartment()) as any;
  return (
    <div className="w-full text-[var(--text)] text-sm overflow-y-scroll pb-8">
      <div className="absolute top-4 -ml-4 px-4">
        <PageInfo
          title="Settings"
          info="Adjust your pay register system in this page."
        />
      </div>
      <div>
        <SettingsTable departments={departments} />
      </div>
      <div className="flex flex-row gap-x-4 items-center justify-end font-semibold mt-4 px-4">
        <button className="rounded-md bg-blue-200 hover:bg-blue-300 active:bg-blue-400 active:text-white py-2 px-6 text-[var(--accent)] cursor-pointer">
          Apply
        </button>
        <button className="rounded-md bg-[var(--border)] hover:bg-slate-300 active:bg-slate-400 active:text-white py-2 px-6 cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
