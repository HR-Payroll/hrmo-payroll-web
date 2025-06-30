"use client";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React from "react";
import { FieldError, UseFormSetValue } from "react-hook-form";

type InputFieldProps = {
  label: string;
  name: string;
  defaultValue?: Date;
  error?: FieldError;
  setValue: UseFormSetValue<any>;
  validator?: () => boolean;
};

const TimePickerField = ({
  label,
  name,
  defaultValue,
  error,
  setValue,
  validator,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col text-sm gap-2 text-[var(--text)]">
      <label className="text-left">{label}</label>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileTimePicker
          slotProps={{
            textField: {
              size: "small",
              variant: "outlined",
            },
          }}
          onAccept={(value) => {
            setValue(name, value, { shouldValidate: true });
          }}
          onChange={(value) => {
            setValue(name, value, { shouldValidate: true });
          }}
          defaultValue={defaultValue}
        />
      </LocalizationProvider>
      {error?.message && <p className="text-red text-xs">{error.message}</p>}
    </div>
  );
};

export default TimePickerField;
