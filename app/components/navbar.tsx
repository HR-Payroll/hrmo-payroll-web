"use client";
import React from "react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const Navbar = () => {
  return (
    <div className="flex items-center justify-self-end p-4">
      <span className="text-4xl text-[#333333]">
        <MdOutlineAdminPanelSettings />
      </span>
      <div className="hidden lg:block flex-col  pt-1 px-2 text-[#333333]">
        <p className="font-semibold text-sm">HR Officer - Job Order</p>
        <p className="text-xs">Administrator</p>
      </div>
    </div>
  );
};

export default Navbar;
