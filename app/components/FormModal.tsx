"use client";
import React, { JSX, useState } from "react";
import DepartmentForm from "@/app/components/forms/DepartmentForm";
import EmployeeForm from "@/app/components/forms/EmployeeForm";
import CompRateForm from "./forms/CompRateForm";
import MandDeducForm from "./forms/MandDeducForm";
import {
  MdModeEditOutline,
  MdDeleteOutline,
  MdOutlineClose,
} from "react-icons/md";
import AddButton from "./AddButton";
import dynamic from "next/dynamic";

// Lazy Loading
{
  /*
const DepartmentForm = dynamic(() => import("./forms/DepartmentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EmployeeForm = dynamic(() => import("./forms/EmployeeForm"), {
  loading: () => <h1>Loading...</h1>,
}); */
}

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  department: (type, data) => <DepartmentForm type={type} data={data} />,
  employee: (type, data) => <EmployeeForm type={type} data={data} />,
  rate: (type, data) => <CompRateForm type={type} data={data} />,
  deduction: (type, data) => <MandDeducForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  title,
  data,
  id,
}: {
  table: "department" | "employee" | "rate" | "deduction";
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
      <form
        action=""
        className="flex flex-col gap-4 text-[#333333] text-sm p-4"
      >
        <div className="flex flex-col gap-4 text-center">
          <span className="font-semibold">{title}</span>
          <span>Are you sure you want to delete this {table}?</span>
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          <button className="w-max bg-blue-200 rounded-md hover:bg-blue-300 active:bg-blue-400 active:text-white text-[#0000ff] py-2 px-4">
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
        <div className="w-screen h-screen absolute left-0 top-0 bg-blue-500/50 z-50 flex items-center justify-center">
          <div className="relative w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[20%] bg-white rounded-md border-2 border-[#ECEEF6] p-4">
            <Form />
            <div className="absolute top-4 right-4 cursor-pointer">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md hover:bg-gray-100 text-[#333333] text-md ml-10 -mt-1 p-1"
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
