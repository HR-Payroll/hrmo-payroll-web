"use client";
import React, { JSX } from "react";

const AddButton = ({ type, icon }: { type: string; icon: JSX.Element }) => {
  return (
    <div className="flex flex-row items-center justify-center rounded-md bg-blue-200 hover:bg-blue-300 active:bg-blue-300 active:text-white gap-1 py-2 px-6 text-[#0000ff]">
      <span className="text-base">{icon}</span>
      <button className="hidden lg:block text-xs">{type}</button>
    </div>
  );
};

export default AddButton;
