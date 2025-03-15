"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RateSchema } from "@/lib/zod";
import InputField from "../InputField";
import Button from "../ui/Button";
import { z } from "zod";

const CompensationRateForm = ({
  data,
  onClose,
}: {
  data?: any;
  onClose: Function;
}) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof RateSchema>>({
    resolver: zodResolver(RateSchema),
    defaultValues: {
      category: "",
      department: "",
      employee: "",
      rate: "",
      type: "",
    },
  });

  const CATEGORY_OPTIONS: Record<string, string> = {
    Regular: "REGULAR",
    Casual: "CASUAL",
    "Job Order": "JOB_ORDER",
  };

  const TYPE_OPTIONS: Record<string, string> = {
    Daily: "DAILY",
    Weekly: "WEEKLY",
    "Bi-weekly": "BI-WEEKLY",
    Monthly: "MONTHLY",
    Contractual: "CONTRACTUAL",
  };

  return (
    <form className="flex flex-col gap-4 text-[#333333] p-4">
      <h1 className="text-center text-base font-semibold">
        Add Employee Compensation Rate
      </h1>
      <div className="flex flex-col text-sm gap-2 text-[#333333]">
        <label className="text-left">Category</label>
        <select
          className="w-full bg-transparent rounded-md ring-2 ring-[#ECEEF6] focus:outline-2 focus:outline-blue-200 p-2"
          {...register("category")}
          defaultValue={data?.category}
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
      <div className="flex flex-col text-sm gap-2 text-[#333333]">
        <label className="text-left">Department</label>
        <select
          className="w-full bg-transparent rounded-md ring-2 ring-[#ECEEF6] focus:outline-2 focus:outline-blue-200 p-2"
          {...register("department")}
          defaultValue={data?.department}
        >
          {/* ADD OPTIONS */}
        </select>
        {errors.department?.message && (
          <p className="text-[#ff0000] text-xs">
            {errors.department.message.toString()}
          </p>
        )}
      </div>
      <div className="flex flex-col text-sm gap-2 text-[#333333]">
        <label className="text-left">Employee</label>
        <select
          className="w-full bg-transparent rounded-md ring-2 ring-[#ECEEF6] focus:outline-2 focus:outline-blue-200 p-2"
          {...register("employee")}
          defaultValue={data?.employee}
        >
          {/* ADD OPTIONS */}
        </select>
        {errors.employee?.message && (
          <p className="text-[#ff0000] text-xs">
            {errors.employee.message.toString()}
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
      <div className="flex flex-col text-sm gap-2 text-[#333333]">
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
          label={isAdding ? "Creating..." : "Create"}
          type="submit"
          isLoading={isAdding}
        />
      </div>
      {serverError && <p style={{ color: "red" }}>{serverError}</p>}
    </form>
  );
};

export default CompensationRateForm;
