"use client";
import { format } from "date-fns";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const DateFilter = ({ from }: { from: Date }) => {
  const [dateFrom, setDateFrom] = useState(from);
  const [dateTo, setDateTo] = useState(new Date());

  const router = useRouter();
  const pathname = usePathname();

  const onChangeDate = ({ from, to }: { from?: Date; to?: Date }) => {
    const newFrom = from || dateFrom;
    const newTo = to || dateTo;

    if (newTo <= newFrom) {
      newTo.setDate(newFrom.getDate() + 1);
      setDateTo(newTo);
    }

    router.push(
      `${pathname}?from=${format(
        newFrom.toISOString(),
        "yyyy-MM-dd"
      )}&to=${format(newTo.toISOString(), "yyyy-MM-dd")}`
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[var(--text)]">
      <div className="flex flex-row items-center justify-between gap-x-4">
        <span className="text-sm font-medium">From:</span>
        <input
          value={format(dateFrom.toISOString(), "yyyy-MM-dd")}
          type="date"
          className="rounded-md border-2 border-[var(--border)] text-sm py-1.5 px-4 cursor-pointer"
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
          className="rounded-md border-2 border-[var(--border)] text-sm py-1.5 px-4 cursor-pointer"
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
