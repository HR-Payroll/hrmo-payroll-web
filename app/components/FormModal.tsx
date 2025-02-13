"use client";
import {
  MdModeEditOutline,
  MdDeleteOutline,
  MdOutlineClose,
} from "react-icons/md";
import AddButton from "./AddButton";
import dynamic from "next/dynamic";
import { JSX, useState } from "react";

// Lazy Loading
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

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  department: (type, data) => <DepartmentForm type={type} data={data} />,
  employee: (type, data) => <EmployeeForm type={type} data={data} />,
  rate: (type, data) => <CompRateForm type={type} data={data} />,
  deduction: (type, data) => <MandDeducForm type={type} data={data} />,
  loan: (type, data) => <LoanDeducForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  title,
  data,
  id,
}: {
  table: "department" | "employee" | "rate" | "deduction" | "loan";
  type: "create" | "update" | "delete";
  title: string;
  data?: any;
  id?: number;
}) => {
  const icon =
    type === "create" ? (
      <AddButton title={title} />
    ) : type === "update" ? (
      <MdModeEditOutline />
    ) : (
      <MdDeleteOutline />
    );
  const [open, setOpen] = useState(false);
  const Form = () => {
    return type === "delete" && id ? (
      <form action="" className="flex flex-col gap-4 text-[#333333] text-xs">
        <div className="flex flex-col gap-4 text-center">
          <span className="font-semibold">{title}</span>
          <span>Are you sure you want to delete this {table}?</span>
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          <button className="w-max bg-blue-200 rounded-md hover:bg-blue-300 active:bg-blue-400 active:text-white text-[#0000ff] py-2 px-4 cursor-pointer">
            Delete
          </button>
        </div>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{icon}</div>
      {open && (
        <div className="h-screen w-full absolute top-0 left-0 bg-radial from-blue-500/50 from-5% to-transparent z-50 flex items-center justify-center">
          <div className="relative w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] bg-white rounded-md border-2 border-[#ECEEF6] p-4">
            <Form />
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md hover:bg-slate-200 active:bg-slate-300 active:text-white text-[#333333] text-md ml-10 -mt-1 p-1 cursor-pointer"
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

export default FormModal;
