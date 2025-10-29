"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEmployee } from "@/actions/employee";
import { EmployeeSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Button from "../ui/Button";
import { z } from "zod";

const EmployeeForm = ({
  data,
  onClose,
  departments,
  schedules,
  setSnackbar,
}: {
  data?: any;
  onClose: Function;
  setSnackbar: Function;
  departments: {
    name: string;
    category: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  schedules: any[];
}) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof EmployeeSchema>>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      recordNo: "",
      name: "",
      category: "",
      departmentId: undefined,
      scheduleId: undefined,
    },
  });

  const CATEGORY_OPTIONS: Record<string, string> = {
    Regular: "REGULAR",
    Casual: "CASUAL",
    "Job Order": "JOB_ORDER",
  };

  const onSubmit = async (data: z.infer<typeof EmployeeSchema>) => {
    setServerError(null);
    setIsAdding(true);

    const employeeData: Employee = { ...data, createdAt: new Date() };

    try {
      const result = await createEmployee(employeeData);
      if (result && result.error) {
        setIsAdding(false);
        return setSnackbar({
          message: result.error,
          type: "error",
          modal: true,
        });
      }

      setSnackbar({
        message: result.success,
        type: "success",
        modal: true,
      });

      setIsAdding(false);
      onClose();
    } catch (error: any) {
      setSnackbar({
        message: error.message,
        type: "error",
        modal: true,
      });
      setIsAdding(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 -[var(--text)]text p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-center text-base font-semibold">Add Employee</h1>
      <InputField
        label="ID Number"
        name="recordNo"
        defaultValue={data?.recordNo}
        register={register}
        error={errors?.recordNo}
        maxLength={9}
      />
      <InputField
        label="Employee Name"
        name="name"
        defaultValue={data?.name}
        register={register}
        error={errors?.name}
      />
      <div className="flex flex-col text-sm gap-2">
        <label className="text-left">Category</label>
        <select
          className="w-full bg-transparent rounded-md ring-2 ring-[var(--border)] focus:outline-2 focus:outline-blue-200 p-2"
          {...register("category")}
          defaultValue={data?.category}
        >
          <option value="" disabled>
            -- Select a category --
          </option>
          {Object.keys(CATEGORY_OPTIONS).map((key: string) => {
            return (
              <option key={key} value={CATEGORY_OPTIONS[key]}>
                {key}
              </option>
            );
          })}
        </select>
        {errors.category?.message && (
          <p className="text-[var(--error)] text-xs">
            {errors.category.message.toString()}
          </p>
        )}
      </div>
      <div className="flex flex-col text-sm gap-2">
        <label className="text-left">Department</label>
        <select
          className="w-full bg-transparent rounded-md ring-2 ring-[var(--border)] focus:outline-2 focus:outline-blue-200 p-2"
          value={watch("departmentId") || ""}
          onChange={(e) => {
            setValue("departmentId", Number(e.target.value), {
              shouldValidate: true,
            });
          }}
        >
          <option value="" disabled>
            -- Select a department --
          </option>
          {departments &&
            departments.length > 0 &&
            departments.map((item: any) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.category}
                </option>
              );
            })}
        </select>
        {errors.departmentId?.message && (
          <p className="text-[var(--error)] text-xs">
            {errors.departmentId.message.toString()}
          </p>
        )}
      </div>
      <div className="flex flex-col text-sm gap-2">
        <label className="text-left">Schedule</label>
        <select
          className="w-full bg-transparent rounded-md ring-2 ring-[var(--border)] focus:outline-2 focus:outline-blue-200 p-2"
          onChange={(e) => {
            setValue("scheduleId", Number(e.target.value), {
              shouldValidate: true,
            });
          }}
          value={watch("scheduleId") || ""}
        >
          <option value="" disabled>
            -- Select a schedule --
          </option>
          {schedules &&
            schedules.length > 0 &&
            schedules.map((item: any) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              );
            })}
        </select>
        {errors.scheduleId?.message && (
          <p className="text-[var(--error)] text-xs">
            {errors.scheduleId.message.toString()}
          </p>
        )}
      </div>
      <div className="mt-4">
        <Button
          label={isAdding ? "Creating..." : "Create"}
          type="submit"
          isLoading={isAdding}
        />
      </div>

      {serverError && <p style={{ color: "red" }}>{serverError}</p>}
    </form>
  );
};

export default EmployeeForm;
