"use client";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md"; // Import dropdown icon

type FilterProps = {
  onFilterChange: (filters: { category: string; department: string }) => void;
};

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");

  const handleFilterChange = () => {
    onFilterChange({ category, department });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      {/* Category Dropdown */}
      <div className="relative flex flex-row items-center justify-between gap-4">
        <select
          className="appearance-none rounded-md bg-transparent ring-2 ring-[#ECEEF6] text-[#333333] text-xs py-1.5 px-6 cursor-pointer"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            handleFilterChange();
          }}
        >
          <option value="">All Categories</option>
          <option value="Regular">Regular</option>
          <option value="Casual">Casual</option>
          <option value="Job Order">Job Order</option>
        </select>
        {/* Custom Dropdown Icon */}
        <MdOutlineKeyboardArrowDown className="absolute top-1/2 right-2 transform -translate-y-1/2 text-md text-gray-500 pointer-events-none cursor-pointer" />
      </div>

      {/* Department Dropdown */}
      <div className="relative flex flex-row items-center justify-between gap-2">
        <select
          className="appearance-none rounded-md bg-transparent ring-2 ring-[#ECEEF6] text-[#333333] text-xs py-1.5 px-6 cursor-pointer"
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            handleFilterChange();
          }}
        >
          <option value="">All Departments</option>
          <option value="Accounting Office">Accounting Office</option>
          <option value="Assessor's Office">Assessor's Office</option>
          <option value="Consultant's Office">Consultant's Office</option>
          <option value="Contractual 20%">Contractual 20%</option>
          <option value="Dept. of Agriculture">Dept. of Agriculture</option>
        </select>
        {/* Custom Dropdown Icon */}
        <MdOutlineKeyboardArrowDown className="absolute top-1/2 right-2 transform -translate-y-1/2 text-md text-gray-500 pointer-events-none cursor-pointer" />
      </div>
    </div>
  );
};

export default Filter;
