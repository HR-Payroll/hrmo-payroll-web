import React from "react";
import UploadButton from "@/components/UploadButton";
import AddButton from "@/components/AddButton";
import CompensationRateTable from "@/components/tables/CompensationRateTable";
import { getAllRate } from "@/data/compensation-rate";
import { getAllDepartment } from "@/data/department";

const CompensationRate = async () => {
  const rates = (await getAllRate()) as any;
  const departments = (await getAllDepartment()) as any;
  return (
    <div className="flex-1 rounded-md bg-white border-2 border-[#ECEEF6] gap-4 mt-10 sm:mt-0 p-4 text-[#333333]">
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="hidden sm:block text-base font-semibold text-[#333333]">
          Compensation Rate
        </h1>
        <div className="flex flex-row items-center justify-end gap-4 sm:gap-4 cursor-pointer">
          <UploadButton />
          <AddButton table="rate" title="Add Rate" />
        </div>
      </div>
      <div className="mt-4">
        <CompensationRateTable rates={rates} departments={departments} />
      </div>
    </div>
  );
};

export default CompensationRate;
