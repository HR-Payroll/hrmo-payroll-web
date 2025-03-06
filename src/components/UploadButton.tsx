"use client";
import React from "react";
import { MdOutlineUploadFile } from "react-icons/md";

const UploadButton = () => {
  return (
    <div className="flex flex-row items-center justify-center rounded-md bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white py-2 px-6">
      <label
        className="flex items-center text-xs text-[#333333] gap-2 cursor-pointer"
        htmlFor="img"
      >
        <MdOutlineUploadFile size={18} />
        <span className="hidden lg:block text-sm">Upload File</span>
      </label>
      <input
        type="file"
        id="img"
        className="hidden"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </div>
  );
};

export default UploadButton;
