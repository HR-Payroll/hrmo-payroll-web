import React from "react";
import { revalidatePath } from "next/cache";
import { getPaginatedSchedule } from "@/data/schedule";
import PageInfo from "@/components/PageInfo";
import AddButton from "@/components/AddButton";
import TableSearch from "@/components/TableSearch";
import WorkSchedulesTable from "@/components/tables/WorkSchedulesTable";

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
    <div className="container flex flex-col text-sm gap-2">
      <header className="absolute top-4 -ml-4">
        <PageInfo
          title="Work Schedules"
          info="Manage your work schedules in this page."
        />
      </header>

      <main className="space-y-4">
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <TableSearch />
          <AddButton title="Add Schedule" table="schedule" reload={reload} />
        </section>

        <section>
          <WorkSchedulesTable
            reload={reload}
            schedules={schedules.items || []}
            limit={schedules.pageSize}
            rowCount={schedules.pageRange}
            page={schedules.page}
          />
        </section>
      </main>
    </div>
  );
}

export default Schedules;
