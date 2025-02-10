"use client";
import React from "react";
import { MdOutlineUploadFile } from "react-icons/md";

const UploadButton = () => {
  return (
    <div className="flex flex-row items-center justify-center rounded-md bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white gap-1 py-2 px-6 text-[#333333]">
      <span className="text-base">
        <MdOutlineUploadFile />
      </span>
      <button className="hidden lg:block text-xs">Upload File</button>
    </div>
  );
};

export default UploadButton;
