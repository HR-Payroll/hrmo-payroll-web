"use client";
import React, { JSX, useState } from "react";
import dynamic from "next/dynamic";
import { MdOutlineAdd, MdOutlineClose } from "react-icons/md";
import SnackbarInfo, { initialSnackbar } from "./ui/SnackbarInfo";

const DepartmentForm = dynamic(() => import("./forms/DepartmentForm"), {
  loading: () => <h1 className="text-xs text-[var(--text)]">Loading...</h1>,
});
const EmployeeForm = dynamic(() => import("./forms/EmployeeForm"), {
  loading: () => <h1 className="text-xs text-[var(--text)]">Loading...</h1>,
});
const CompRateForm = dynamic(() => import("./forms/CompRateForm"), {
  loading: () => <h1 className="text-xs text-[var(--text)]">Loading...</h1>,
});
const MandDeducForm = dynamic(() => import("./forms/MandDeducForm"), {
  loading: () => <h1 className="text-xs text-[var(--text)]">Loading...</h1>,
});
const LoanDeducForm = dynamic(() => import("./forms/LoanDeducForm"), {
  loading: () => <h1 className="text-xs text-[var(--text)]">Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1 className="text-xs text-[var(--text)]">Loading...</h1>,
});

const AddButton = ({
  title,
  table,
  data,
  reload,
}: {
  title: string;
  table: string;
  data?: any;
  reload?: VoidFunction;
}) => {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    modal: false,
  });

  const forms: { [key: string]: () => JSX.Element } = {
    department: () => <DepartmentForm onClose={onClose} />,
    employee: () => (
      <EmployeeForm
        setSnackbar={(params: any) => {
          setSnackbar(params);
        }}
        departments={data}
        onClose={onClose}
      />
    ),
    rate: () => <CompRateForm onClose={() => {}} />,
    deduction: () => <MandDeducForm onClose={() => {}} />,
    loan: () => <LoanDeducForm onClose={() => {}} />,
    event: () => <EventForm onClose={onClose} />,
  };

  const onClose = () => {
    if (reload) reload();
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-row items-center justify-center rounded-md bg-blue-200 hover:bg-blue-300 active:bg-blue-400 active:text-white gap-1 py-2 px-6 text-[var(--accent)] cursor-pointer"
      >
        <MdOutlineAdd size={18} />
        <span className="hidden md:block text-sm">{title}</span>
      </button>

      {open && (
        <div className="h-full w-full fixed top-0 left-0 bg-radial from-blue-500/50 from-5% to-transparent to-80% z-50 flex items-center justify-center">
          <div className="relative w-[70%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[20%] bg-white rounded-md border-2 border-[var(--border)] p-4">
            {forms[table] ? forms[table]() : <h1>Form not found!</h1>}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setOpen(false)}
                className="rounded-full hover:bg-blue-100 active:bg-blue-200 active:text-[var(--accent)] text-[var(--text)] text-base p-2 cursor-pointer"
              >
                <MdOutlineClose />
              </button>
            </div>
          </div>
        </div>
      )}
      {snackbar.modal && (
        <SnackbarInfo
          isOpen={snackbar.modal}
          type={snackbar.type as any}
          message={snackbar.message}
          onClose={() => {
            setSnackbar(initialSnackbar);
          }}
        />
      )}
    </>
  );
};

export default AddButton;
