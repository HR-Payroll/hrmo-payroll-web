import React from "react";
import TableSearch from "@/app/components/TableSearch";
import UploadButton from "@/app/components/UploadButton";
import AddButton from "@/app/components/AddButton";
import { MdOutlineAdd } from "react-icons/md";

const Departments = () => {
  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] m-4 mt-0 p-4 text-[#333333]">
      {/* Search and Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <TableSearch />
        </div>
        <div className="flex flex-row items-center gap-4">
          <div>
            <UploadButton />
          </div>
          <div>
            <AddButton type="Add Department" icon={<MdOutlineAdd />} />
          </div>
        </div>
      </div>
      {/* Table */}
    </div>
  );
};

export default Departments;
