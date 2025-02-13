"use client";
import React, { useState } from "react";
import PageInfo from "@/app/components/PageInfo";
import TableSearch from "@/app/components/TableSearch";
import Filters from "@/app/components/Filters";
import UploadButton from "@/app/components/UploadButton";
import DownloadButton from "@/app/components/DownloadButton";
import DateFilter from "@/app/components/DateFilter";
import Table from "@/app/components/Table";
import Pagination from "@/app/components/Pagination";
import { indivReportData } from "@/app/lib/data";

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
    header: "Time In (Morning)",
    accessor: "timeinam",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  {
    header: "Time Out (Morning)",
    accessor: "timeoutam",
    className: "hidden md:table-cell font-semibold p-2",
  },
  {
    header: "Time In (Afternoon)",
    accessor: "timeinpm",
    className: "hidden md:table-cell font-semibold p-2",
  },
  {
    header: "Time Out (Afternoon)",
    accessor: "timeoutpm",
    className: "hidden sm:table-cell font-semibold p-2",
  },
];

const SingleReportPage = () => {
  const [filteredData, setFilteredData] = useState(indivReportData);

  const handleFilterChange = ({
    category,
    department,
  }: {
    category: string;
    department: string;
  }) => {
    let filtered = indivReportData;

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
      <td className="p-2">{item.date}</td>
      <td className="p-2">{item.name}</td>
      <td className="hidden sm:table-cell p-2">{item.timeinam}</td>
      <td className="hidden md:table-cell p-2">{item.timeoutam}</td>
      <td className="hidden md:table-cell p-2">{item.timeinpm}</td>
      <td className="hidden sm:table-cell p-2">{item.timeoutpm}</td>
    </tr>
  );

  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 m-4 mt-8 p-4 text-[#333333]">
      {/* Page Information */}
      <div className="absolute top-0 left-0 p-4">
        <PageInfo
          title="Report"
          info="Manage your company's employee reports in this page. You can view employee daily time record here."
        />
      </div>
      {/* Search and Buttons */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="">
            <TableSearch />
          </div>
          <div className="flex flex-row items-center justify-center gap-4 cursor-pointer">
            <UploadButton />
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

export default SingleReportPage;
