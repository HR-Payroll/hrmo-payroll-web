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
    <div className="flex items-center justify-between p-4">
      <div>
        <h1 className="text-xl font-semibold text-[#333333]">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Welcome to HRMO - Payroll Management System. Here's your overview.
        </p>
      </div>

      <div className="relative flex flex-row items-center">
        <span className="text-4xl text-[#333333]">
          <MdOutlineAdminPanelSettings />
        </span>
        <div className="hidden lg:block flex-col pt-1 px-2 text-[#333333]">
          <p className="font-semibold text-sm">HR Officer - Job Order</p>
          <p className="text-xs">Administrator</p>
        </div>
        <div
          className="cursor-pointer ml-2"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {isDropdownOpen ? (
            <MdOutlineKeyboardArrowUp className="text-xl text-[#333333]" />
          ) : (
            <MdOutlineKeyboardArrowDown className="text-xl text-[#333333]" />
          )}
        </div>

        {isDropdownOpen && (
          <div className="absolute top-12 right-0 w-48 bg-white border rounded-md shadow-lg text-sm text-[#333333]">
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
