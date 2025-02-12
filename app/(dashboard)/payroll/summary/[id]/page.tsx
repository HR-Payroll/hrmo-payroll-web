"use client";
import React from "react";
import TableSearch from "@/app/components/TableSearch";
import UploadButton from "@/app/components/UploadButton";
import DownloadButton from "@/app/components/DownloadButton";
import Table from "@/app/components/Table";
import Pagination from "@/app/components/Pagination";
import { indivSummaryData } from "@/app/lib/data";

const columns = [
  {
    header: "Date",
    accessor: "date",
    className: "font-semibold p-2",
  },
  {
    header: "Employee Name",
    accessor: "name",
    className: "font-semibold p-2",
  },
  {
    header: "Gross Salary",
    accessor: "salary",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  {
    header: "Late Deduction",
    accessor: "deductions",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  {
    header: "Total Earnings",
    accessor: "earnings",
    className: "hidden sm:table-cell font-semibold p-2",
  },
];

const SingleSummaryPage = () => {
  const renderRow = (item: any) => (
    <tr
      key={item.id}
      className="border-t border-[#ECEEF6] even:bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-xs text-[#333333]"
    >
      <td className="p-2">{item.date}</td>
      <td className="p-2">{item.name}</td>
      <td className="hidden sm:table-cell p-2">{item.salary}</td>
      <td className="hidden sm:table-cell p-2">{item.deductions}</td>
      <td className="hidden sm:table-cell p-2">{item.earnings}</td>
    </tr>
  );

  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-0 p-4 text-[#333333]">
      {/* Search and Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <TableSearch />
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="cursor-pointer">
            <UploadButton />
          </div>
          <div className="cursor-pointer">
            <DownloadButton />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={indivSummaryData}
        rowRenderer={renderRow}
      />

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default SingleSummaryPage;
