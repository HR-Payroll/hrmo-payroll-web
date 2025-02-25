"use client";
import React, { useState } from "react";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logged out successfully!");
    window.location.href = "/login";
  };

  return (
    <div className="relative w-full flex flex-row items-center justify-between">
      <div className="hidden lg:block items-center">
        <h1 className="text-base font-semibold text-[#333333]">
          HRMO - Payroll Management System
        </h1>
        <h6 className="text-xs text-gray-600">
          Automate your company's payroll register in this system.
        </h6>
      </div>
      <div className="absolute top-0 right-0 flex flex-row items-center justify-center">
        <MdOutlineAdminPanelSettings className="text-4xl text-[#333333]" />
        <div className="hidden sm:block flex-col pt-1 px-2 text-[#333333]">
          <p className="font-medium text-xs">HR Officer - Job Order</p>
          <p className="text-[10px]">Administrator</p>
        </div>
        <div
          className="cursor-pointer ml-2"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {isDropdownOpen ? (
            <MdOutlineKeyboardArrowUp className="text-lg text-[#333333]" />
          ) : (
            <MdOutlineKeyboardArrowDown className="text-lg text-[#333333]" />
          )}
        </div>
        {isDropdownOpen && (
          <div className="absolute top-10 right-0 w-48 bg-white border border-[#333333] rounded-md shadow-lg text-xs text-[#333333]">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
