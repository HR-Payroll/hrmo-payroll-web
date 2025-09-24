"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const TableFilters = ({
  data,
  departments,
}: {
  data?: any;
  departments: {
    name: string;
    category: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const CATEGORY_OPTIONS: Record<string, string> = {
    "All Category": "",
    Regular: "REGULAR",
    Casual: "CASUAL",
    "Job Order": "JOB_ORDER",
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
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[var(--text)] text-sm">
      <div className="relative flex flex-row items-center justify-center gap-2">
        <select
          className="appearance-none outline-none rounded-md ring-2 ring-[var(--border)] py-1.5 px-8 cursor-pointer"
          defaultValue={data?.category}
          onChange={(e) => {
            setCategoryFilter(e.target.value),
              onChangeFilter("category", e.target.value);
          }}
          value={categoryFilter}
        >
          {Object.keys(CATEGORY_OPTIONS).map((key: string) => {
            return (
              <option key={key} value={CATEGORY_OPTIONS[key]}>
                {key}
              </option>
            );
          })}
        </select>
        <MdOutlineKeyboardArrowDown
          className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 pointer-events-none cursor-pointer"
          size={18}
        />
      </div>
      <div className="relative flex flex-row items-center justify-between gap-2">
        <select
          className="appearance-none outline-none rounded-md ring-2 ring-[var(--border)] py-1.5 px-4 cursor-pointer"
          defaultValue={data?.department}
          onChange={(e) => onChangeFilter("department", e.target.value)}
        >
          <option value="">All Departments</option>
          {departments &&
            departments.length > 0 &&
            departments
              .filter((item: any) =>
                categoryFilter === "" ? true : categoryFilter === item.category
              )
              .map((item: any) => {
                const category = {
                  REGULAR: "Regular",
                  CASUAL: "Casual",
                  JOB_ORDER: "Job Order",
                } as any;
                return (
                  <option key={item.id} value={item.id}>
                    {`${item.name} - ${category[item.category]}`}
                  </option>
                );
              })}
        </select>
        <MdOutlineKeyboardArrowDown
          className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 pointer-events-none cursor-pointer"
          size={18}
        />
      </div>
    </div>
  );
};

export default TableFilters;
