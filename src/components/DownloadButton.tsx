"use client";
import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";

const DownloadButton = () => {
  return (
    <div className="flex flex-row items-center justify-center rounded-md bg-[var(--border)] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[var(--text)] text-sm cursor-pointer gap-x-2 py-2 px-5">
      <MdOutlineFileDownload size={18} />
      <span className="hidden md:block">Download File</span>
    </div>
  );
};

export default DownloadButton;
