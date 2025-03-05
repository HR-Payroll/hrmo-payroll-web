"use client";
import React, { useState } from "react";
import InputField from "../InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MandatorySchema } from "@/lib/zod";
import { createDeductions } from "@/actions/deductions";
import Button from "../ui/Button";

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
      gsisgs: "",
      ec: "",
      gsisps: "",
      phic: "",
      hdmfgs: "",
      hdmfps: "",
      wtax: "",
      sss: "",
    },
  });

  const CATEGORY_OPTIONS: Record<string, string> = {
    Regular: "REGULAR",
    Casual: "CASUAL",
    "Job Order": "JOB_ORDER",
  };

  const onSubmit = async (data: z.infer<typeof MandatorySchema>) => {
    setServerError(null);
    setIsAdding(true);

    try {
      const result = await createDeductions(data);
      setIsAdding(false);
      console.log(result);
      onClose();
    } catch (error) {
      console.log(error);
      setIsAdding(false);
    }
  };

  return (
    <form
      className="h-[500px] flex flex-col gap-4 text-[#333333]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-center text-sm font-semibold">
        Add Mandatory Deductions
      </h1>
      <div className="overflow-y-scroll flex flex-col gap-4 p-4">
        <div className="flex flex-col text-xs gap-2 text-[#333333]">
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
            <p className="text-[#ff0000] text-[10px]">
              {errors.category.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col text-xs gap-2 text-[#333333]">
          <label className="text-left">Department</label>
          <select
            className="w-full bg-transparent rounded-md ring-2 ring-[#ECEEF6] focus:outline-2 focus:outline-blue-200 p-2"
            {...register("department")}
            defaultValue={data?.department}
          >
            {/* ADD OPTIONS */}
          </select>
          {errors.department?.message && (
            <p className="text-[#ff0000] text-[10px]">
              {errors.department.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col text-xs gap-2 text-[#333333]">
          <label className="text-left">Employee</label>
          <select
            className="w-full bg-transparent rounded-md ring-2 ring-[#ECEEF6] focus:outline-2 focus:outline-blue-200 p-2"
            {...register("employee")}
            defaultValue={data?.employee}
          >
            {/* ADD OPTIONS */}
          </select>
          {errors.employee?.message && (
            <p className="text-[#ff0000] text-[10px]">
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
        <Button
          label={isAdding ? "Creating..." : "Create"}
          type="submit"
          isLoading={isAdding}
        />
        {serverError && <p style={{ color: "red" }}>{serverError}</p>}
      </div>
    </form>
  );
};

export default MandDeductionForm;
