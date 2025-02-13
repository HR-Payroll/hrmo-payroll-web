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
    <div className="flex flex-row items-center absolute top-0 right-0 p-4">
      <span className="text-4xl text-[#333333]">
        <MdOutlineAdminPanelSettings />
      </span>

      <div className="flex-col pt-1 px-2 text-[#333333]">
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
        <div className="absolute top-14 right-4 w-48 bg-white border border-[#333333] rounded-md shadow-lg text-xs text-[#333333]">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
