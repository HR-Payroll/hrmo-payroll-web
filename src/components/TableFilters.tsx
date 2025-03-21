"use client";
import React from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const TableFilters = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[#333333] text-sm">
      <div className="relative flex flex-row items-center justify-center gap-4">
        <select className="appearance-none rounded-md border-2 border-[#ECEEF6] py-1.5 px-8 cursor-pointer">
          <option value="">All Categories</option>
          <option value="Regular">Regular</option>
          <option value="Casual">Casual</option>
          <option value="Job Order">Job Order</option>
        </select>
        <MdOutlineKeyboardArrowDown
          className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 pointer-events-none cursor-pointer"
          size={18}
        />
      </div>
      <div className="relative flex flex-row items-center justify-between gap-2">
        <select className="appearance-none rounded-md border-2 border-[#ECEEF6] py-1.5 px-4 cursor-pointer">
          <option value="">All Departments</option>
          <option value="Accounting Office">Accounting Office</option>
          <option value="Assessor's Office">Assessor's Office</option>
          <option value="Consultant's Office">Consultant's Office</option>
          <option value="Contractual 20%">Contractual 20%</option>
          <option value="Dept. of Agriculture">Dept. of Agriculture</option>
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
