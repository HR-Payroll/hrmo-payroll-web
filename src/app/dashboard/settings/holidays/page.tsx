import React from "react";
import { revalidatePath } from "next/cache";
import { getEventsByDateRange } from "@/actions/events";
import { getBusinessDays, getTotalHolidays } from "@/utils/holidays";
import PageInfo from "@/components/PageInfo";
import AddButton from "@/components/AddButton";
import PayCalendar from "@/components/PayCalendar";
import HolidaysEventsTable from "@/components/tables/HolidaysEventsTable";

const HolidaysSettingsPage = async (props: {
  searchParams?: Promise<{
    from?: string;
  }>;
}) => {
  const params = await props.searchParams;
  const { from } = params as any;

  const now = new Date(from || new Date());
  const dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
  const dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const events = (await getEventsByDateRange(dateFrom, dateTo)) as any;
  const businessDays = getBusinessDays(dateFrom, dateTo);
  const totalBusinessDays = businessDays - getTotalHolidays(events.items || []);

  async function reload() {
    "use server";
    revalidatePath("/dashboard/settings/holidays");
  }

  return (
    <div className="container flex flex-col text-sm gap-4">
      <header className="absolute top-4 -ml-4">
        <PageInfo
          title="Holidays & Events Settings"
          info="Manage your holidays and events in this page. You can add, edit, or delete events that will affect the pay calendar."
        />
      </header>

      <main className="space-y-4">
        <section className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-base font-semibold">Holidays & Events</h1>
          </div>
          <div className="flex items-center gap-8">
            <h1 className="text-base">
              Total Working Days: {totalBusinessDays}
            </h1>
            <AddButton title="Add Event" table="event" reload={reload} />
          </div>
        </section>

        <section className="flex flex-col md:flex-row gap-4">
          <HolidaysEventsTable events={events.items || []} reload={reload} />
          <div className="w-full max-w-1/4">
            <PayCalendar isFilter={true} events={events.items || []} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HolidaysSettingsPage;
