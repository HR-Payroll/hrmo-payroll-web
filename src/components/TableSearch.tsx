"use client";
import { debounce } from "@/utils/tools";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";

const TableSearch = () => {
  const router = useRouter();
  const pathname = usePathname();

  const debounceSearch = debounce((value: string) => {
    if (value === "" || value === null) return router.push(pathname);
    router.push(`${pathname}?search=${value}`);
  }, 500);

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
