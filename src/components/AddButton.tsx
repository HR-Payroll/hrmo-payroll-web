"use client";
import React, { JSX, useState } from "react";
import dynamic from "next/dynamic";
import { MdOutlineAdd, MdOutlineClose } from "react-icons/md";

const DepartmentForm = dynamic(() => import("./forms/DepartmentForm"), {
  loading: () => <h1 className="text-xs text-[#333333]">Loading...</h1>,
});
const EmployeeForm = dynamic(() => import("./forms/EmployeeForm"), {
  loading: () => <h1 className="text-xs text-[#333333]">Loading...</h1>,
});
const CompRateForm = dynamic(() => import("./forms/CompRateForm"), {
  loading: () => <h1 className="text-xs text-[#333333]">Loading...</h1>,
});
const MandDeducForm = dynamic(() => import("./forms/MandDeducForm"), {
  loading: () => <h1 className="text-xs text-[#333333]">Loading...</h1>,
});
const LoanDeducForm = dynamic(() => import("./forms/LoanDeducForm"), {
  loading: () => <h1 className="text-xs text-[#333333]">Loading...</h1>,
});

const forms: { [key: string]: () => JSX.Element } = {
  department: () => <DepartmentForm />,
  employee: () => <EmployeeForm />,
  rate: () => <CompRateForm />,
  deduction: () => <MandDeducForm />,
  loan: () => <LoanDeducForm />,
};

const AddButton = ({ title, table }: { title: string; table: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-row items-center justify-center rounded-md bg-blue-200 hover:bg-blue-300 active:bg-blue-400 active:text-white gap-1 py-2 px-6 text-[#0000ff] cursor-pointer"
      >
        <MdOutlineAdd size={16} />
        <span className="hidden lg:block text-xs">{title}</span>
      </button>

      {open && (
        <div className="h-full w-full fixed top-0 left-0 bg-radial from-blue-500/50 from-5% to-transparent to-80% z-50 flex items-center justify-center">
          <div className="relative w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] bg-white rounded-md border-2 border-[#ECEEF6] p-4">
            {forms[table] ? forms[table]() : <h1>Form not found!</h1>}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md hover:bg-slate-200 active:bg-slate-300 active:text-white text-[#333333] text-md p-1 cursor-pointer"
              >
                <MdOutlineClose />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddButton;
