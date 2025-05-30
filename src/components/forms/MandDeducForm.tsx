"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MandatorySchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Button from "../ui/Button";
import { z } from "zod";

const MandDeductionForm = ({
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
  } = useForm<z.infer<typeof MandatorySchema>>({
    resolver: zodResolver(MandatorySchema),
    defaultValues: {
      category: "",
      department: "",
      employee: "",
      gsisgs: 0,
      ec: 0,
      gsisps: 0,
      phic: 0,
      hdmfgs: 0,
      hdmfps: 0,
      wtax: 0,
      sss: 0,
    },
  });

  const CATEGORY_OPTIONS: Record<string, string> = {
    Regular: "REGULAR",
    Casual: "CASUAL",
    "Job Order": "JOB_ORDER",
  };

  return (
    <form className="h-[500px] flex flex-col gap-4 text-[var(--text)]">
      <h1 className="text-center text-base font-semibold">
        Add Mandatory Deductions
      </h1>
      <div className="overflow-y-scroll flex flex-col gap-4 p-4">
        <div className="flex flex-col text-sm gap-2 text-[var(--text)]">
          <label className="text-left">Category</label>
          <select
            className="w-full bg-transparent rounded-md ring-2 ring-[var(--border)] focus:outline-2 focus:outline-blue-200 p-2"
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
            <p className="text-[var(--error)] text-xs">
              {errors.category.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col text-sm gap-2 text-[var(--text)]">
          <label className="text-left">Department</label>
          <select
            className="w-full bg-transparent rounded-md ring-2 ring-[var(--border)] focus:outline-2 focus:outline-blue-200 p-2"
            {...register("department")}
            defaultValue={data?.department}
          >
            {/* ADD OPTIONS */}
          </select>
          {errors.department?.message && (
            <p className="text-[var(--error)] text-xs">
              {errors.department.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col text-sm gap-2 text-[var(--text)]">
          <label className="text-left">Employee</label>
          <select
            className="w-full bg-transparent rounded-md ring-2 ring-[var(--border)] focus:outline-2 focus:outline-blue-200 p-2"
            {...register("employee")}
            defaultValue={data?.employee}
          >
            {/* ADD OPTIONS */}
          </select>
          {errors.employee?.message && (
            <p className="text-[var(--error)] text-xs">
              {errors.employee.message.toString()}
            </p>
          )}
        </div>
        <InputField
          label="GSIS (GS)"
          name="gsisgs"
          defaultValue={data?.gsisgs}
          register={register}
          error={errors?.gsisgs}
        />
        <InputField
          label="EC"
          name="ec"
          defaultValue={data?.ec}
          register={register}
          error={errors?.ec}
        />
        <InputField
          label="GSIS (PS)"
          name="gsisps"
          defaultValue={data?.gsisps}
          register={register}
          error={errors?.gsisps}
        />
        <InputField
          label="PHIC"
          name="phic"
          defaultValue={data?.phic}
          register={register}
          error={errors?.phic}
        />
        <InputField
          label="HDMF (GS)"
          name="hdmfgs"
          defaultValue={data?.hdmfgs}
          register={register}
          error={errors?.hdmfgs}
        />
        <InputField
          label="HDMF (PS)"
          name="hdmfps"
          defaultValue={data?.hdmfps}
          register={register}
          error={errors?.hdmfps}
        />
        <InputField
          label="WTax"
          name="wtax"
          defaultValue={data?.wtax}
          register={register}
          error={errors?.wtax}
        />
        <InputField
          label="SSS"
          name="sss"
          defaultValue={data?.sss}
          register={register}
          error={errors?.sss}
        />
        <div className="mt-4">
          <Button
            label={isAdding ? "Creating..." : "Create"}
            type="submit"
            isLoading={isAdding}
          />
        </div>
        {serverError && <p style={{ color: "red" }}>{serverError}</p>}
      </div>
    </form>
  );
};

export default MandDeductionForm;
