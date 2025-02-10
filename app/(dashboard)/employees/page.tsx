"use client";
import React from "react";
import TableSearch from "@/app/components/TableSearch";
import UploadButton from "@/app/components/UploadButton";
import FormModal from "@/app/components/FormModal";
import AddButton from "@/app/components/AddButton";
import Table from "@/app/components/Table";
import Pagination from "@/app/components/Pagination";
import { employeeData } from "@/app/lib/data";
import {
  MdOutlineAdd,
  MdModeEditOutline,
  MdDeleteOutline,
} from "react-icons/md";

const columns = [
  {
    header: "ID Number",
    accessor: "employeeId",
    className: "font-semibold p-2",
  },
  {
    header: "Employee Name",
    accessor: "name",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  {
    header: "Department",
    accessor: "department",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  {
    header: "Category",
    accessor: "category",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  { header: "Actions", accessor: "actions", className: "font-semibold p-2" },
];

const Employees = () => {
  const renderRow = (item: any) => (
    <tr
      key={item.id}
      className="border-t border-[#ECEEF6] even:bg-slate-50 hover:bg-slate-100 text-xs text-[#333333]"
    >
      <td className="p-1">{item.employeeId}</td>
      <td className="hidden sm:table-cell p-1">{item.name}</td>
      <td className="hidden sm:table-cell p-1">{item.department}</td>
      <td className="hidden sm:table-cell text-[#008000] p-1">
        {item.category}
      </td>
      <td className="p-1">
        <div className="flex items-center justify-center gap-2 text-base">
          <button className="rounded-full bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] p-1">
            <MdModeEditOutline />
          </button>
          {/* <FormModal table="employees" type="update" /> */}
          <button className="rounded-full bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] p-1">
            <MdDeleteOutline />
          </button>
          {/* <FormModal table="employees" type="delete" id={item.id} /> */}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="relative flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-0 p-4 text-[#333333]">
      {/* Search and Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <TableSearch />
        </div>
        <div className="flex flex-row items-center gap-4">
          <div>
            <UploadButton />
          </div>
          <div>
            <FormModal table="employees" type="create" />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} data={employeeData} rowRenderer={renderRow} />

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default Employees;
