"use client";
import React from "react";
import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col text-sm gap-2 text-[#333333]">
      <label className="text-left">{label}</label>
      <input
        name={name}
        type={type}
        placeholder="Enter here"
        {...register(name)}
        {...inputProps}
        defaultValue={defaultValue}
        className="w-full bg-transparent rounded-md ring-2 ring-[#ECEEF6] focus:outline-2 focus:outline-blue-200 p-2"
      />
      {error?.message && (
        <p className="text-[#ff0000] text-xs">{error?.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
