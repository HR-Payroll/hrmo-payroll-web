"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import React, { useState } from "react";
import Calendar, { OnArgs } from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const PayCalendar = ({
  isFilter,
  events,
}: {
  isFilter?: boolean;
  events?: any[];
}) => {
  const [value, onChange] = useState<Value>(new Date());

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChangeFilter = (key: string, value: string) => {
    let path = "";
    const params = Object.fromEntries(searchParams.entries());

    if (params[key]) delete params[key];
    if (value) params[key] = value;

    Object.keys(params).forEach((key, index) => {
      if (index === 0) path += `?${key}=${params[key]}`;
      else path += `&${key}=${params[key]}`;
    });

    router.push(`${pathname}${path}`);
  };

  return (
    <div className="rounded-md bg-white border-2 border-[var(--border)] p-4 text-sm text-[var(--text)]">
      <Calendar
        onActiveStartDateChange={(args: OnArgs) => {
          if (isFilter) {
            const from = format(
              args.activeStartDate || new Date(),
              "yyyy-MM-dd"
            );
            onChangeFilter("from", from);
          }
        }}
        onChange={onChange}
        value={value}
        tileClassName={({ date, view }) => {
          if (
            view === "month" &&
            events?.some(
              (d) => d.startDate.toDateString() === date.toDateString()
            )
          ) {
            return "text-red-600 !bg-red-100";
          }
          return null;
        }}
      />
    </div>
  );
};

export default PayCalendar;
