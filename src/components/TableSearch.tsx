"use client";
import React from "react";
import { MdOutlineSearch } from "react-icons/md";

const TableSearch = () => {
  return (
    <div className="w-full md:auto flex items-center rounded-md ring-[2px] ring-[#ECEEF6] gap-2 text-sm">
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-transparent pl-2 py-1.5"
      />
      <button className="text-gray-300 hover:text-gray-400 active:text-gray-500 cursor-pointer pr-2">
        <MdOutlineSearch size={18} />
      </button>
    </div>
  );
};

export default TableSearch;
