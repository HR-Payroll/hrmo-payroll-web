"use client";
import React from "react";

const PageInfo = ({ title, info }: { title: string; info: string }) => {
  return (
    <div className="hidden lg:block">
      <h1 className="text-lg font-semibold text-[#333333]">{title}</h1>
      <p className="text-sm text-gray-600 text-wrap -mt-1">{info}</p>
    </div>
  );
};

export default PageInfo;
