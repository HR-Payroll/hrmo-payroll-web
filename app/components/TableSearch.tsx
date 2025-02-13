"use client";
import React from "react";
import { MdOutlineSearch } from "react-icons/md";

const TableSearch = () => {
  return (
    <div className="w-full md:auto flex items-center rounded-md ring-[2px] ring-[#ECEEF6] gap-2 px-2 text-xs">
      <div className="text-base text-gray-300">
        <MdOutlineSearch />
      </div>
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-transparent focus:ring-2 focus:ring-slate-300 px-2 py-1.5"
      ></input>
    </div>
  );
};

export default TableSearch;
