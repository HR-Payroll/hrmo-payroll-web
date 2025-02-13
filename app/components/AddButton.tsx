"use client";
import React from "react";
import { MdOutlineAdd } from "react-icons/md";

const AddButton = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-row items-center justify-center rounded-md bg-blue-200 hover:bg-blue-300 active:bg-blue-400 active:text-white gap-1 py-2 px-6 text-[#0000ff]">
      <MdOutlineAdd className="text-base" />
      <span className="hidden lg:block text-xs">{title}</span>
    </div>
  );
};

export default AddButton;
