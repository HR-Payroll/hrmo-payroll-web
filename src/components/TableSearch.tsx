"use client";
import { debounce } from "@/utils/tools";
import { format } from "date-fns";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";

const TableSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dateFilter, setDateFilter] = useState<{
    from: Date | null;
    to: Date | null;
  }>({ from: null, to: null });

  const debounceSearch = debounce((value: string) => {
    let path = "";
    if (dateFilter.from && dateFilter.to && value) {
      path = `?from=${format(
        dateFilter.from.toISOString(),
        "yyyy-MM-dd"
      )}&to=${format(
        dateFilter.to.toISOString(),
        "yyyy-MM-dd"
      )}&search=${value}`;
    } else if (dateFilter.from && dateFilter.to) {
      path = `?from=${format(
        dateFilter.from.toISOString(),
        "yyyy-MM-dd"
      )}&to=${format(dateFilter.to.toISOString(), "yyyy-MM-dd")}`;
    } else if (value) {
      path = `?search=${value}`;
    }

    router.push(`${pathname}${path}`);
  }, 500);

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (from && to) {
      setDateFilter({ from: new Date(from), to: new Date(to) });
    } else {
      setDateFilter({ from: null, to: null });
    }
  }, [searchParams]);

  return (
    <div className="w-full md:auto flex items-center rounded-md ring-[2px] ring-[#ECEEF6] gap-2 text-sm">
      <input
        placeholder="Search"
        className="w-full bg-transparent pl-2 py-1.5 outline-none"
        onChange={(e) => debounceSearch(e.target.value)}
      />
      <button className="text-gray-300 hover:text-gray-400 active:text-gray-500 cursor-pointer pr-2">
        <MdOutlineSearch size={18} />
      </button>
    </div>
  );
};

export default TableSearch;
