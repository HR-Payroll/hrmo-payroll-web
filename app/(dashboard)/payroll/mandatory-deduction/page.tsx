"use client";
import React, { useState } from "react";
import PageInfo from "@/app/components/PageInfo";
import TableSearch from "@/app/components/TableSearch";
import Filters from "@/app/components/Filters";
import UploadButton from "@/app/components/UploadButton";
import FormModal from "@/app/components/FormModal";
import Table from "@/app/components/Table";
import Pagination from "@/app/components/Pagination";
import { mandDeducData } from "@/app/lib/data";

const columns = [
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
    header: "GSIS (GS)",
    accessor: "gsisgs",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  {
    header: "EC",
    accessor: "ec",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  {
    header: "GSIS (PS)",
    accessor: "gsisps",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  {
    header: "PHIC",
    accessor: "phic",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  {
    header: "HDMF (GS)",
    accessor: "hdmf-gs",
    className: "hidden md:table-cell font-semibold p-2",
  },
  {
    header: "HDMF (PS)",
    accessor: "hdmf-ps",
    className: "hidden md:table-cell font-semibold p-2",
  },
  {
    header: "WTax",
    accessor: "wtax",
    className: "hidden md:table-cell font-semibold p-2",
  },
  {
    header: "SSS",
    accessor: "sss",
    className: "hidden md:table-cell font-semibold p-2",
  },
  { header: "Actions", accessor: "actions", className: "font-semibold p-2" },
];

const MandatoryDeductions = () => {
  const [filteredData, setFilteredData] = useState(mandDeducData);

  const handleFilterChange = ({
    category,
    department,
  }: {
    category: string;
    department: string;
  }) => {
    let filtered = mandDeducData;

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
      <td className="p-1">{item.name}</td>
      <td className="hidden sm:table-cell p-1">{item.department}</td>
      <td className="hidden sm:table-cell p-1">{item.gsisgs}</td>
      <td className="hidden sm:table-cell p-1">{item.ec}</td>
      <td className="hidden sm:table-cell p-1">{item.gsisps}</td>
      <td className="hidden sm:table-cell p-1">{item.phic}</td>
      <td className="hidden md:table-cell p-1">{item.hdmfgs}</td>
      <td className="hidden md:table-cell p-1">{item.gsisps}</td>
      <td className="hidden md:table-cell p-1">{item.wtax}</td>
      <td className="hidden md:table-cell p-1">{item.sss}</td>
      <td className="p-1">
        <div className="flex items-center justify-center gap-2 text-base">
          <div className="flex items-center justify-center rounded-full bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] p-1 cursor-pointer">
            <FormModal
              table="deduction"
              type="update"
              title="Edit Mandatory Deductions"
              data={{
                id: 1,
                category: "Job Order",
                deptname: "Accounting Office",
                empname: "CAILING, CHRISTY",
                gsisgs: "0.00",
                ec: "0.00",
                gsisps: "0.00",
                phic: "0.00",
                hdmfgs: "0.00",
                hdmfps: "0.00",
                wtax: "0.00",
                sss: "0.00",
              }}
            />
          </div>
          <div className="flex items-center justify-center rounded-full bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] p-1 cursor-pointer">
            <FormModal
              table="deduction"
              type="delete"
              title="Delete Mandatory Deductions"
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
          title="Payroll Register"
          info="Manage your employee's mandatory deductions for the payroll register in this page."
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
            <FormModal table="deduction" type="create" title="Add Deductions" />
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

export default MandatoryDeductions;
