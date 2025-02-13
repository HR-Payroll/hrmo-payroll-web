"use client";
import React, { useState } from "react";
import PageInfo from "@/app/components/PageInfo";
import TableSearch from "@/app/components/TableSearch";
import Filters from "@/app/components/Filters";
import UploadButton from "@/app/components/UploadButton";
import FormModal from "@/app/components/FormModal";
import Table from "@/app/components/Table";
import Pagination from "@/app/components/Pagination";
import { loanDeducData } from "@/app/lib/data";

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
    header: "MPL-HDMF",
    accessor: "mplhdmf",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  {
    header: "GFAL",
    accessor: "gfal",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  {
    header: "Landbank",
    accessor: "landbank",
    className: "hidden sm:table-cell font-semibold p-2",
  },
  {
    header: "CB",
    accessor: "cb",
    className: "hidden md:table-cell font-semibold p-2",
  },
  {
    header: "EML",
    accessor: "eml",
    className: "hidden md:table-cell font-semibold p-2",
  },
  {
    header: "MPL-GSIS",
    accessor: "mplgsis",
    className: "hidden md:table-cell font-semibold p-2",
  },
  {
    header: "Tagum Bank",
    accessor: "tagum",
    className: "hidden md:table-cell font-semibold p-2",
  },
  {
    header: "UCPB",
    accessor: "ucpb",
    className: "hidden lg:table-cell font-semibold p-2",
  },
  {
    header: "MPL-LITE",
    accessor: "mpllite",
    className: "hidden lg:table-cell font-semibold p-2",
  },
  {
    header: "SB",
    accessor: "sb",
    className: "hidden lg:table-cell font-semibold p-2",
  },
  { header: "Actions", accessor: "actions", className: "font-semibold p-2" },
];

const LoanDeductions = () => {
  const [filteredData, setFilteredData] = useState(loanDeducData);

  const handleFilterChange = ({
    category,
    department,
  }: {
    category: string;
    department: string;
  }) => {
    let filtered = loanDeducData;

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
      <td className="hidden sm:table-cell p-1">{item.mplhdmf}</td>
      <td className="hidden sm:table-cell p-1">{item.gfal}</td>
      <td className="hidden sm:table-cell p-1">{item.landbank}</td>
      <td className="hidden md:table-cell p-1">{item.cb}</td>
      <td className="hidden md:table-cell p-1">{item.eml}</td>
      <td className="hidden md:table-cell p-1">{item.mplgsis}</td>
      <td className="hidden md:table-cell p-1">{item.tagum}</td>
      <td className="hidden lg:table-cell p-1">{item.ucpb}</td>
      <td className="hidden lg:table-cell p-1">{item.mpllite}</td>
      <td className="hidden lg:table-cell p-1">{item.sb}</td>
      <td className="p-1">
        <div className="flex items-center justify-center gap-2 text-base">
          <div className="flex items-center justify-center rounded-full bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] p-1 cursor-pointer">
            <FormModal
              table="loan"
              type="update"
              title="Edit Loan and Other Deductions"
              data={{
                id: 1,
                category: "Job Order",
                deptname: "Accounting Office",
                empname: "CAILING, CHRISTY",
                mplhdmf: "0.00",
                gfal: "0.00",
                landbank: "0.00",
                cb: "0.00",
                eml: "0.00",
                mplgsis: "0.00",
                tagum: "0.00",
                ucpb: "0.00",
                mpllite: "0.00",
                sb: "0.00",
              }}
            />
          </div>
          <div className="flex items-center justify-center rounded-full bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] p-1 cursor-pointer">
            <FormModal
              table="loan"
              type="delete"
              title="Delete Loan and Other Deductions"
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
          info="Manage your employee's loans and other deductions for the payroll register in this page."
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
            <FormModal table="loan" type="create" title="Add Deductions" />
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

export default LoanDeductions;
