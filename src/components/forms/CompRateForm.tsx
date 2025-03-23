"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateRate } from "@/actions/rate";
import { RateSchema } from "@/lib/zod";
import { useForm, useWatch } from "react-hook-form";
import InputField from "../InputField";
import Button from "../ui/Button";
import { z } from "zod";

const CompensationRateForm = ({
  data,
  onClose,
  departments,
  employees,
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
  employees: {
    recordNo?: string;
    name?: string;
    department?: any;
    category?: string;
    rate?: number;
    type?: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof RateSchema>>({
    resolver: zodResolver(RateSchema),
    defaultValues: {
      category: "",
      department: "",
      employee: "",
      rate: 0,
      type: "",
    },
  });

  const selectedEmployeeId = watch("employee");

  useEffect(() => {
    const selectedEmployee = employees.find(
      (emp: any) => emp._id.$oid === selectedEmployeeId
    );

    if (selectedEmployee) {
      setValue("department", selectedEmployee.department?._id.$oid || "");
      setValue("category", selectedEmployee.category || "");
    }
  }, [selectedEmployeeId, employees, setValue]);

  const CATEGORY_OPTIONS: Record<string, string> = {
    Regular: "REGULAR",
    Casual: "CASUAL",
    "Job Order": "JOB_ORDER",
  };

  const TYPE_OPTIONS: Record<string, string> = {
    Daily: "DAILY",
    Monthly: "MONTHLY",
  };

  const onSubmit = async (data: z.infer<typeof RateSchema>) => {
    setServerError(null);
    setIsUpdating(true);

    try {
      const selectedEmployee = employees.find(
        (emp: any) => emp._id.$oid === data.employee
      );

      if (!selectedEmployee) {
        setIsUpdating(false);
        return setSnackbar({
          message: "Selected employee not found.",
          type: "error",
          modal: true,
        });
      }

      const updatedRateData = {
        ...data,
        category: selectedEmployee.category || "",
        department: selectedEmployee.department?._id.$oid || "",
      };

      const result = await updateRate(data.employee, updatedRateData);

      if (result?.error) {
        setIsUpdating(false);
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

      setIsUpdating(false);
      onClose();
    } catch (error: any) {
      setSnackbar({
        message: error.message,
        type: "error",
        modal: true,
      });
      setIsUpdating(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 text-[#333333] p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-center text-base font-semibold">
        Update Employee Compensation Rate
      </h1>
      <div className="flex flex-col text-sm gap-2 ">
        <label className="text-left">Employee</label>
        <select
          className="w-full bg-transparent rounded-md ring-2 ring-[#ECEEF6] focus:outline-2 focus:outline-blue-200 p-2"
          {...register("employee")}
          defaultValue=""
        >
          {employees &&
            employees.length > 0 &&
            employees.map((item: any) => {
              return (
                <option key={item._id.$oid} value={item._id.$oid}>
                  {item.name}
                </option>
              );
            })}
        </select>
        {errors.employee?.message && (
          <p className="text-[#ff0000] text-xs">
            {errors.employee.message.toString()}
          </p>
        )}
      </div>
      <div className="flex flex-col text-sm gap-2 ">
        <label className="text-left">Department</label>
        <select
          className="appearance-none w-full bg-transparent rounded-md ring-2 ring-[#ECEEF6] text-gray-500 p-2"
          {...register("department")}
          disabled
        >
          {departments &&
            departments.length > 0 &&
            departments.map((item: any) => {
              return (
                <option key={item._id.$oid} value={item._id.$oid}>
                  {item.name}
                </option>
              );
            })}
        </select>
        {errors.department?.message && (
          <p className="text-[#ff0000] text-xs">
            {errors.department.message.toString()}
          </p>
        )}
      </div>
      <div className="flex flex-col text-sm gap-2 ">
        <label className="text-left">Category</label>
        <select
          className="appearance-none w-full bg-transparent rounded-md ring-2 ring-[#ECEEF6] text-gray-500 p-2"
          {...register("category")}
          disabled
        >
          {Object.keys(CATEGORY_OPTIONS).map((key: string) => {
            return (
              <option key={key} value={CATEGORY_OPTIONS[key]}>
                {key}
              </option>
            );
          })}
        </select>
        {errors.category?.message && (
          <p className="text-[#ff0000] text-xs">
            {errors.category.message.toString()}
          </p>
        )}
      </div>
      <InputField
        label="Rate"
        name="rate"
        defaultValue={data?.rate}
        register={register}
        error={errors?.rate}
      />
      <div className="flex flex-col text-sm gap-2 ">
        <label className="text-left">Type</label>
        <select
          className="w-full bg-transparent rounded-md ring-2 ring-[#ECEEF6] focus:outline-2 focus:outline-blue-200 p-2"
          {...register("type")}
          defaultValue={data?.type}
        >
          {Object.keys(TYPE_OPTIONS).map((key: string) => {
            return (
              <option key={key} value={TYPE_OPTIONS[key]}>
                {key}
              </option>
            );
          })}
        </select>
        {errors.type?.message && (
          <p className="text-[#ff0000] text-xs">
            {errors.type.message.toString()}
          </p>
        )}
      </div>
      <div className="mt-4">
        <Button
          label={isUpdating ? "Updating..." : "Update"}
          type="submit"
          isLoading={isUpdating}
        />
      </div>
      {serverError && <p style={{ color: "red" }}>{serverError}</p>}
    </form>
  );
};

export default CompensationRateForm;
