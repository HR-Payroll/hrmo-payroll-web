"use client";
import React from "react";

const DateFilter = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-x-4">
        <span className="text-sm font-medium">From:</span>
        <input
          type="date"
          className="rounded-md border-2 border-[#ECEEF6] text-sm py-1.5 px-4 cursor-pointer"
        />
      </div>
      <div className="flex flex-row items-center justify-between gap-x-4">
        <span className="text-sm font-medium">To:</span>
        <input
          type="date"
          className="rounded-md border-2 border-[#ECEEF6] text-sm py-1.5 px-4 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default DateFilter;
