"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  getDateFromCache,
  getDateToCache,
  setDateFromCache,
  setDateToCache,
} from "@/services/localStorage";
import { format } from "date-fns";

const DateFilter = () => {
  const [dateFrom, setDateFrom] = useState<Date>(getDateFromCache());
  const [dateTo, setDateTo] = useState<Date>(getDateToCache());

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** Load initial dates */
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const hasQuery = !!params.from || !!params.to;

    const from = hasQuery
      ? params.from
        ? new Date(params.from)
        : getDateFromCache() || new Date()
      : getDateFromCache() || new Date();

    const to = hasQuery
      ? params.to
        ? new Date(params.to)
        : getDateToCache() || new Date()
      : getDateToCache() || new Date();

    setDateFrom(from);
    setDateTo(to);

    // override cache when query params exist
    if (hasQuery) {
      setDateFromCache(format(from, "yyyy-MM-dd"));
      setDateToCache(format(to, "yyyy-MM-dd"));
    }
  }, [searchParams]);

  /** Sync cache whenever date changes */
  useEffect(() => {
    setDateFromCache(format(dateFrom, "yyyy-MM-dd"));
    setDateToCache(format(dateTo, "yyyy-MM-dd"));
  }, [dateFrom, dateTo]);

  const onChangeDate = ({ from, to }: { from?: Date; to?: Date }) => {
    const newFrom = from || dateFrom;
    const newTo = to || dateTo;

    if (newTo <= newFrom) {
      newTo.setDate(newFrom.getDate());
      setDateTo(newTo);
    }

    onChangeFilter([
      { key: "from", value: format(newFrom, "yyyy-MM-dd") },
      { key: "to", value: format(newTo, "yyyy-MM-dd") },
    ]);
  };

  const onChangeFilter = (keys: { key: string; value: string }[]) => {
    let path = "";
    const params = Object.fromEntries(searchParams.entries());

    for (const key of keys) {
      if (params[key.key]) delete params[key.key];
      if (key.value) params[key.key] = key.value;
    }

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
          value={format(dateFrom, "yyyy-MM-dd")}
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
          value={format(dateTo, "yyyy-MM-dd")}
          type="date"
          className="outline-none rounded-md border-2 border-[var(--border)] text-sm py-1.5 px-4 cursor-pointer"
          min={format(dateFrom, "yyyy-MM-dd")}
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
