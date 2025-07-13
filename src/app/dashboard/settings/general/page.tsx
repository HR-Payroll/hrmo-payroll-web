import React from "react";
import { syncHolidays } from "@/actions/events";
import { getSettings } from "@/actions/settings";
import { getAllDepartment } from "@/data/department";
import PageInfo from "@/components/PageInfo";
import SettingsTable from "@/components/tables/SettingsTable";

async function General() {
  const departments = (await getAllDepartment()) as any;
  const settings = (await getSettings()) as any;
  const year = new Date().getFullYear();

  if (settings.syncHolidays !== year.toString()) await syncHolidays(year);
  return (
    <div className="w-full text-[var(--text)] text-sm pb-8 overflow-y-scroll">
      <header className="absolute top-4 -ml-4 px-4">
        <PageInfo
          title="Settings"
          info="Adjust your pay register system in this page."
        />
      </header>

      <main>
        <SettingsTable departments={departments} settings={settings} />
      </main>
    </div>
  );
}

export default General;
