"use client";
import React, { useState } from "react";
import PageInfo from "@/app/components/PageInfo";
import TableSearch from "@/app/components/TableSearch";
import Filters from "@/app/components/Filters";
import UploadButton from "@/app/components/UploadButton";
import FormModal from "@/app/components/FormModal";
import Table from "@/app/components/Table";
import Pagination from "@/app/components/Pagination";
import { employeeData } from "@/app/lib/data";

const columns = [
  {
    header: "ID Number",
    accessor: "employeeId",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  {
    header: "Employee Name",
    accessor: "name",
    className: "font-semibold p-2",
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
  const [filteredData, setFilteredData] = useState(employeeData);

  const handleFilterChange = ({
    category,
    department,
  }: {
    category: string;
    department: string;
  }) => {
    let filtered = employeeData;

    if (category) {
      filtered = filtered.filter((emp) => emp.category === category);
    }
    if (department) {
      filtered = filtered.filter((emp) => emp.department === department);
    }

    setFilteredData(filtered);
  };

  const renderRow = (item: any) => (
    <tr
      key={item.id}
      className="border-t border-[#ECEEF6] even:bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-xs text-[#333333]"
    >
      <td className="hidden sm:table-cell p-1">{item.employeeId}</td>
      <td className="p-1">{item.name}</td>
      <td className="hidden sm:table-cell p-1">{item.department}</td>
      <td className="hidden sm:table-cell text-[#008000] p-1">
        {item.category}
      </td>
      <td className="p-1">
        <div className="flex items-center justify-center gap-2 text-base">
          <div className="flex items-center justify-center rounded-full bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] p-1 cursor-pointer">
            <FormModal
              table="employee"
              type="update"
              title="Edit Employee"
              data={{
                id: 1,
                idnum: 2025010001,
                empname: "CAILING, CHRISTY",
                category: "Job Order",
                deptname: "Accounting Office",
              }}
            />
          </div>
          <div className="flex items-center justify-center rounded-full bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] p-1 cursor-pointer">
            <FormModal
              table="employee"
              type="delete"
              title="Delete Employee"
              id={item.id}
            />
          </div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-10 p-4 text-[#333333]">
      {/* Page Information */}
      <div className="absolute top-0 left-0 p-4">
        <PageInfo
          title="Employees"
          info="Manage your company's employees in this page. You can add, edit, or delete employee details here."
        />
      </div>
      {/* Search and Buttons */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <TableSearch />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 cursor-pointer">
          <div>
            <Filters onFilterChange={handleFilterChange} />
          </div>
          <div className="flex flex-row items-center justify-center gap-4 cursor-pointer">
            <UploadButton />
            <FormModal table="employee" type="create" title="Add Employee" />
          </div>
        </div>
      </div>
      {/* Table */}
      <Table columns={columns} data={filteredData} rowRenderer={renderRow} />
      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default Employees;
