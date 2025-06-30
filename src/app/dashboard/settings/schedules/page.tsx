import AddButton from "@/components/AddButton";
import PageInfo from "@/components/PageInfo";
import WorkSchedulesTable from "@/components/tables/WorkSchedulesTable";
import TableSearch from "@/components/TableSearch";
import { getPaginatedSchedule } from "@/data/schedule";
import { revalidatePath } from "next/cache";
import React from "react";

async function Schedules(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const params = await props.searchParams;
  const { search, page, limit } = params as any;

  const schedules = (await getPaginatedSchedule(
    search,
    Number(page || 0),
    Number(limit || 10)
  )) as any;

  async function reload() {
    "use server";
    revalidatePath("/dashboard/settings/schedules");
  }

  return (
    <div className="w-full flex flex-col bg-white rounded-md border-2 border-[var(--border)] text-[var(--text)] text-sm gap-2 p-4">
      <div className="absolute top-4 -ml-4">
        <PageInfo
          title="Work Schedules"
          info="Manage your work schedules in this page."
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-y-4">
        <div>
          <TableSearch />
        </div>
        <div className="flex flex-row gap-x-4">
          <AddButton title="Add Schedule" table="schedule" reload={reload} />
        </div>
      </div>
      <WorkSchedulesTable
        reload={reload}
        schedules={schedules.items || []}
        limit={schedules.pageSize}
        rowCount={schedules.pageRange}
        page={schedules.page}
      />
    </div>
  );
}

export default Schedules;
