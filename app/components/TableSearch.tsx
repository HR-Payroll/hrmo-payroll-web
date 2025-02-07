import React from "react";
import { MdOutlineSearch } from "react-icons/md";

const TableSearch = () => {
  return (
    <div className="w-full md:auto flex items-center rounded-md ring-[2px] ring-[#ECEEF6] gap-2 px-2 text-xs">
      <span className="text-base text-gray-300">
        <MdOutlineSearch />
      </span>
      <input
        type="text"
        placeholder="Search"
        className="w-[200px] bg-transparent p-2"
      ></input>
    </div>
  );
};

export default TableSearch;
