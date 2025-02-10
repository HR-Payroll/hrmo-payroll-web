"use client";
import React from "react";
import { MdOutlineAdd } from "react-icons/md";

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table: "departments" | "employees";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  return (
    <>
      <div className="flex flex-row items-center justify-center rounded-md bg-blue-200 hover:bg-blue-300 active:bg-blue-300 active:text-white gap-1 py-2 px-6 text-[#0000ff]">
        <span className="text-base">
          <MdOutlineAdd />
        </span>
        <button className="hidden lg:block text-xs">Add Department</button>
      </div>
    </>
  );
};

export default FormModal;
