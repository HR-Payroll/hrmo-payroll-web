"use client";
import React, { useState } from "react";
import { logOut } from "@/actions/authActions";
import PageInfo from "./PageInfo";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    console.log("Logged out successfully!");
    await logOut();
  };

  return (
    <div className="w-full flex flex-row items-center justify-between text-[#333333] py-4">
      <PageInfo title={""} info={""} />
      <div className="relative flex flex-row items-center justify-center">
        <MdOutlineAdminPanelSettings className="text-4xl" />
        <div className="hidden sm:block flex-col pt-1 px-2">
          <p className="font-semibold text-sm">HRMO - OIC</p>
          <p className="text-xs">Super Administrator</p>
        </div>
        <div
          className="rounded-full hover:bg-blue-100 active:bg-blue-200 active:text-[#0000ff] p-1 cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {isDropdownOpen ? (
            <MdOutlineKeyboardArrowUp size={20} />
          ) : (
            <MdOutlineKeyboardArrowDown size={20} />
          )}
        </div>
        {isDropdownOpen && (
          <div className="absolute top-12 right-0 w-46 bg-white border border-[#333333] rounded-md shadow-lg text-sm">
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
