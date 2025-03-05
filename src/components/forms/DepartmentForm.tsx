"use client";
import React, { useState } from "react";
import InputField from "../InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DepartmentSchema } from "@/lib/zod";
import { createDepartment } from "@/actions/department";
import Button from "../ui/Button";

const DepartmentForm = ({
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
  } = useForm<z.infer<typeof DepartmentSchema>>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: {
      name: "",
      category: "",
    },
  });

  const CATEGORY_OPTIONS: Record<string, string> = {
    Regular: "REGULAR",
    Casual: "CASUAL",
    "Job Order": "JOB_ORDER",
  };

  const onSubmit = async (data: z.infer<typeof DepartmentSchema>) => {
    setServerError(null);
    setIsAdding(true);

    try {
      const result = await createDepartment(data);
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
      className="flex flex-col gap-4 text-[#333333] p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-center text-sm font-semibold">Add Department</h1>
      <InputField
        label="Department Name"
        name="name"
        defaultValue={data?.name}
        register={register}
        error={errors?.name}
      />
      <div className="flex flex-col text-xs gap-2 text-[#333333]">
        <label className="text-left">Category</label>
        <select
          className="w-full bg-transparent rounded-md ring-2 ring-[#ECEEF6] focus:outline-2 focus:outline-blue-200 p-2"
          {...register("category")}
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
      <Button
        label={isAdding ? "Creating..." : "Create"}
        type="submit"
        isLoading={isAdding}
      />
      {serverError && <p style={{ color: "red" }}>{serverError}</p>}
    </form>
  );
};

export default DepartmentForm;
