import React from "react";
import Link from "next/link";
import PageInfo from "@/components/PageInfo";
import { MdArrowBackIosNew } from "react-icons/md";
import HolidaysEventsTable from "@/components/tables/HolidaysEventsTable";
import PayCalendar from "@/components/PayCalendar";
import AddButton from "@/components/AddButton";
import { getEventsByDateRange } from "@/actions/events";
import { getBusinessDays, getTotalHolidays } from "@/utils/holidays";
import { revalidatePath } from "next/cache";

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
    <div className="w-full flex flex-col bg-white rounded-md border-2 border-[var(--border)] text-[var(--text)] text-sm gap-4 p-4">
      <div className="absolute top-4 -ml-4">
        <PageInfo
          title="Holidays & Events Settings"
          info="Manage your holidays and events in this page. You can add, edit, or delete events that will affect the pay calendar."
        />
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 px-4">
          {/* <Link
            href={`/dashboard/settings`}
            className="rounded-full bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] p-2 cursor-pointer"
          >
            <MdArrowBackIosNew size={12} />
          </Link> */}
          <h1 className="text-base font-semibold">Holidays & Events</h1>
        </div>
        <div className="flex flex-row gap-8 items-center">
          <h1 className="text-base">Total Working Days: {totalBusinessDays}</h1>
          <AddButton title="Add Event" table="event" reload={reload} />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <HolidaysEventsTable events={events.items || []} reload={reload} />
        <div className="w-full max-w-1/4">
          <PayCalendar isFilter={true} events={events.items || []} />
        </div>
      </div>
    </div>
  );
};

export default HolidaysSettingsPage;
