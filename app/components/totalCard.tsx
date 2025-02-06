"use client";
import React from "react";
import { MdWorkOutline } from "react-icons/md";

const TotalCards = ({ type }: { type: string }) => {
  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] p-4 text-[#333333]">
      <div className="justify-self-start pb-2 text-xs">
        <p>{type}</p>
      </div>
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-medium">20</h1>
        <span className="p-2 rounded-full bg-blue-100 text-xl text-[#0000ff]">
          <MdWorkOutline />
        </span>
      </div>
      <div className="mt-4 p-1 rounded-full bg-green-100 text-[10px] text-[#008000]">
        <p>+5% from last month</p>
      </div>
    </div>
  );
};

export default TotalCards;
