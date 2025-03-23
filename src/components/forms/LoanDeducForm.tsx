"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoanSchema } from "@/lib/zod";
import InputField from "../InputField";
import Button from "../ui/Button";
import { z } from "zod";

const LoanDeductionForm = ({
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
  } = useForm<z.infer<typeof LoanSchema>>({
    resolver: zodResolver(LoanSchema),
    defaultValues: {
      category: "",
      department: "",
      employee: "",
      mplhdmf: 0,
      gfal: 0,
      landbank: 0,
      cb: 0,
      eml: 0,
      mplgsis: 0,
      tagum: 0,
      ucpb: 0,
      mpllite: 0,
      sb: 0,
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
        Add Loan and Other Deductions
      </h1>
      <div className="overflow-y-scroll flex flex-col gap-4 p-4">
        <div className="flex flex-col text-sm gap-2">
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
        <div className="flex flex-col text-sm gap-2">
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
        <div className="flex flex-col text-sm gap-2">
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
          label="MPL-HDMF"
          name="mplhdmf"
          defaultValue={data?.mplhdmf}
          register={register}
          error={errors?.mplhdmf}
        />
        <InputField
          label="GFAL"
          name="gfal"
          defaultValue={data?.gfal}
          register={register}
          error={errors?.gfal}
        />
        <InputField
          label="Landbank"
          name="landbank"
          defaultValue={data?.landbank}
          register={register}
          error={errors?.landbank}
        />
        <InputField
          label="CB"
          name="cb"
          defaultValue={data?.cb}
          register={register}
          error={errors?.cb}
        />
        <InputField
          label="EML"
          name="eml"
          defaultValue={data?.eml}
          register={register}
          error={errors?.eml}
        />
        <InputField
          label="MPL-GSIS"
          name="mplgsis"
          defaultValue={data?.mplgsis}
          register={register}
          error={errors?.mplgsis}
        />
        <InputField
          label="Tagum Bank"
          name="tagum"
          defaultValue={data?.tagum}
          register={register}
          error={errors?.tagum}
        />
        <InputField
          label="UCPB"
          name="ucpb"
          defaultValue={data?.ucpb}
          register={register}
          error={errors?.ucpb}
        />
        <InputField
          label="MPL-LITE"
          name="mpllite"
          defaultValue={data?.mpllite}
          register={register}
          error={errors?.mpllite}
        />
        <InputField
          label="SB"
          name="sb"
          defaultValue={data?.sb}
          register={register}
          error={errors?.sb}
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

export default LoanDeductionForm;
