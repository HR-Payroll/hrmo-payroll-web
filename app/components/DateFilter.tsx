"use client";
import React, { useState } from "react";
import { MdCalendarToday } from "react-icons/md"; // Import calendar icon

type DateFilterProps = {
  onDateChange: (dates: { startDate: string; endDate: string }) => void;
};

const DateFilter: React.FC<DateFilterProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateChange = () => {
    onDateChange({ startDate, endDate });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
      {/* Start Date */}
      <div className="relative flex flex-row items-center justify-between gap-4">
        <h3 className="text-xs font-medium text-[#333333]">From:</h3>
        <input
          type="date"
          className="appearance-none rounded-md bg-transparent ring-2 ring-[#ECEEF6] text-[#333333] text-xs py-1.5 px-6 cursor-pointer"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            handleDateChange();
          }}
        />
      </div>

      {/* End Date */}
      <div className="relative flex flex-row items-center justify-between gap-4">
        <h3 className="text-xs font-medium text-[#333333]">To:</h3>
        <input
          type="date"
          className="appearance-none rounded-md bg-transparent ring-2 ring-[#ECEEF6] text-[#333333] text-xs py-1.5 px-6 cursor-pointer"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            handleDateChange();
          }}
        />
      </div>
    </div>
  );
};

export default DateFilter;
