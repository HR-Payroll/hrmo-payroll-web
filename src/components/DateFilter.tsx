"use client";
import { format } from "date-fns";
import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const DateFilter = ({ from }: { from: Date }) => {
  const [dateFrom, setDateFrom] = useState(from);
  const [dateTo, setDateTo] = useState(new Date());

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChangeDate = ({ from, to }: { from?: Date; to?: Date }) => {
    const newFrom = from || dateFrom;
    const newTo = to || dateTo;

    if (newTo <= newFrom) {
      newTo.setDate(newFrom.getDate());
      setDateTo(newTo);
    }

    onChangeFilter("from", format(newFrom, "yyyy-MM-dd"));
    onChangeFilter("to", format(newTo, "yyyy-MM-dd"));
  };

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
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[var(--text)]">
      <div className="flex flex-row items-center justify-between gap-x-4">
        <span className="text-sm font-medium">From:</span>
        <input
          value={format(dateFrom.toISOString(), "yyyy-MM-dd")}
          type="date"
          className="outline-none rounded-md border-2 border-[var(--border)] text-sm py-1.5 px-4 cursor-pointer"
          onChange={(e) => {
            setDateFrom(new Date(e.target.value));
            onChangeDate({ from: new Date(e.target.value) });
          }}
        />
      </div>
      <div className="flex flex-row items-center justify-between gap-x-4">
        <span className="text-sm font-medium">To:</span>
        <input
          value={format(dateTo.toISOString(), "yyyy-MM-dd")}
          type="date"
          className="outline-none rounded-md border-2 border-[var(--border)] text-sm py-1.5 px-4 cursor-pointer"
          min={format(dateFrom.toISOString(), "yyyy-MM-dd")}
          onChange={(e) => {
            setDateTo(new Date(e.target.value));
            onChangeDate({ to: new Date(e.target.value) });
          }}
        />
      </div>
    </div>
  );
};

export default DateFilter;
