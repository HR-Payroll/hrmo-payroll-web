"use client";
import React from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

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
  const CATEGORY_OPTIONS: Record<string, string> = {
    Regular: "REGULAR",
    Casual: "CASUAL",
    "Job Order": "JOB_ORDER",
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[#333333] text-sm">
      <div className="relative flex flex-row items-center justify-center gap-4">
        <select
          className="appearance-none rounded-md border-2 border-[#ECEEF6] py-1.5 px-8 cursor-pointer"
          defaultValue={data?.category}
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
          className="appearance-none rounded-md border-2 border-[#ECEEF6] py-1.5 px-4 cursor-pointer"
          defaultValue={data?.department}
        >
          {departments &&
            departments.length > 0 &&
            departments.map((item: any) => {
              return (
                <option key={item._id.$oid} value={item._id.$oid}>
                  {item.name}
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
