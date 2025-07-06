import React from "react";
import PageInfo from "@/components/PageInfo";
import SettingsTable from "@/components/tables/SettingsTable";
import { getAllDepartment } from "@/data/department";
import { syncHolidays } from "@/actions/events";
import { getSettings } from "@/actions/settings";

async function General() {
  const departments = (await getAllDepartment()) as any;
  const settings = (await getSettings()) as any;
  const year = new Date().getFullYear();

  if (settings.syncHolidays !== year.toString()) await syncHolidays(year);
  return (
    <div className="w-full text-[var(--text)] text-sm overflow-y-scroll pb-8">
      <div className="absolute top-4 -ml-4 px-4">
        <PageInfo
          title="Settings"
          info="Adjust your pay register system in this page."
        />
      </div>
      <div>
        <SettingsTable departments={departments} settings={settings} />
      </div>
    </div>
  );
}

export default General;
