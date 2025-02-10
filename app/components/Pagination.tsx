"use client";
import React from "react";

const Pagination = () => {
  return (
    <div className="flex items-center justify-end gap-4 p-4 text-[#333333] text-xs -mr-1 pb-0">
      <button className="rounded-md bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white disabled:opacity-50 disabled:cursor-not-allowed py-1.5 px-2">
        Prev
      </button>
      <button className="rounded-md bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white disabled:opacity-50 disabled:cursor-not-allowed py-1.5 px-2">
        Next
      </button>
      Page:
      <button className="rounded-md bg-transparent ring-[2px] ring-[#ECEEF6] pl-2 py-1.25 pr-6 -m-2">
        1
      </button>
      of
      <button className="text-[#0000ff] -m-3">10</button>
    </div>
  );
};

export default Pagination;
