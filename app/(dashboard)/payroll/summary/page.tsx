"use client";
import React, { useState } from "react";
import PageInfo from "@/app/components/PageInfo";
import TableSearch from "@/app/components/TableSearch";
import Filters from "@/app/components/Filters";
import DownloadButton from "@/app/components/DownloadButton";
import Table from "@/app/components/Table";
import DateFilter from "@/app/components/DateFilter";
import Pagination from "@/app/components/Pagination";
import { summaryData } from "@/app/lib/data";
import { MdOutlineVisibility } from "react-icons/md";
import Link from "next/link";

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
  {
    header: "Total Earnings",
    accessor: "earnings",
    className: "hidden md:table-cell font-semibold p-2",
  },
  {
    header: "Total Deductions",
    accessor: "deductions",
    className: "hidden md:table-cell font-semibold p-2",
  },
  {
    header: "NET INCOME",
    accessor: "income",
    className: "hidden md:table-cell font-semibold p-2",
  },
  { header: "Actions", accessor: "actions", className: "font-semibold p-2" },
];

const Summary = () => {
  const [filteredData, setFilteredData] = useState(summaryData);

  const handleFilterChange = ({
    category,
    department,
  }: {
    category: string;
    department: string;
  }) => {
    let filtered = summaryData;

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
      <td className="hidden sm:table-cell p-1">{item.category}</td>
      <td className="hidden md:table-cell p-1">{item.earnings}</td>
      <td className="hidden md:table-cell p-1">{item.deductions}</td>
      <td className="hidden md:table-cell p-1">{item.income}</td>
      <td className="p-1">
        <div className="flex items-center justify-center gap-2 text-base">
          <Link href={`/summary/${item.id}`}>
            <button className="flex items-center justify-center rounded-full bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] text-base p-1 cursor-pointer">
              <MdOutlineVisibility />
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-10 p-4 text-[#333333]">
      {/* Page Information */}
      <div className="absolute top-0 left-0 p-4">
        <PageInfo
          title="Payroll Register"
          info="View the summary of the employee's payroll register here. You can download the file in excel format."
        />
      </div>
      {/* Search and Buttons */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="">
            <TableSearch />
          </div>
          <div className="flex flex-row items-center justify-center gap-4 cursor-pointer">
            <DownloadButton />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex flex-row items-center justify-center">
            <DateFilter
              onDateChange={function (dates: {
                startDate: string;
                endDate: string;
              }): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
          <div className="flex flex-col lg:flex-row items-center cursor-pointer">
            <h3 className="text-xs font-medium text-[#333333] mr-4 mb-2 lg:mb-0">
              Filters:
            </h3>
            <Filters onFilterChange={handleFilterChange} />
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

export default Summary;
