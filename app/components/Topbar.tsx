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
          LGU Jasaan HRMO - Payroll Management System
        </h1>
        <h6 className="text-xs text-gray-600 text-wrap">
          An automated system that integrates with DTR/biometrics to streamline
          payroll and boost efficiency.
        </h6>
      </div>
      <div className="absolute top-0 right-0 flex flex-row items-center justify-center">
        <MdOutlineAdminPanelSettings className="text-4xl text-[#333333]" />
        <div className="hidden sm:block flex-col pt-1 px-2 text-[#333333]">
          <p className="font-semibold text-xs">HRMO - OIC</p>
          <p className="text-[10px]">Super Administrator</p>
        </div>
        <div
          className="rounded-full hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] p-1 cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {isDropdownOpen ? (
            <MdOutlineKeyboardArrowUp size={20} />
          ) : (
            <MdOutlineKeyboardArrowDown size={20} />
          )}
        </div>
        {isDropdownOpen && (
          <div className="absolute top-10 right-0 w-42 bg-white border border-[#333333] rounded-md shadow-lg text-xs text-[#333333]">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 active:text-black cursor-pointer"
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
