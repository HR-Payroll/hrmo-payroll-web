"use client";
import { formatTime } from "@/utils/dateFormatter";
import { debounce } from "@/utils/tools";
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
  const [searchFilter, setSearchFilter] = useState<string>("");

  const debounceSearch = debounce((value: string) => {
    let path = "";
    if (dateFilter.from && dateFilter.to && value) {
      path = `?from=${formatTime(
        dateFilter.from.toISOString(),
        "yyyy-MM-DD"
      )}&to=${formatTime(
        dateFilter.to.toISOString(),
        "yyyy-MM-DD"
      )}&search=${value}`;
    } else if (dateFilter.from && dateFilter.to) {
      path = `?from=${formatTime(
        dateFilter.from.toISOString(),
        "yyyy-MM-DD"
      )}&to=${formatTime(dateFilter.to.toISOString(), "yyyy-MM-DD")}`;
    } else if (value) {
      path = `?search=${value}`;
    }

    router.push(`${pathname}${path}`);
  }, 500);

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const search = searchParams.get("search") || "";

    if (from && to) {
      setDateFilter({ from: new Date(from), to: new Date(to) });
    } else {
      setDateFilter({ from: null, to: null });
    }

    if (search && searchFilter === "") {
      setSearchFilter(search);
    }
  }, [searchParams]);

  return (
    <div className="w-fit flex items-center rounded-md ring-2 ring-[var(--border)] gap-x-2 text-sm py-1.5">
      <input
        value={searchFilter}
        type="search"
        placeholder="Search"
        className="w-[180px] outline-none pl-4"
        onChange={(e) => (
          setSearchFilter(e.target.value), debounceSearch(e.target.value)
        )}
      />
      <button className="text-gray-300 hover:text-gray-400 active:text-gray-500 cursor-pointer pr-2">
        <MdOutlineSearch size={18} />
      </button>
    </div>
  );
};

export default TableSearch;
