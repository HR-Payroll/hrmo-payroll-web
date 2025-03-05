"use client";
import React, { useState } from "react";
import InputField from "../InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EmployeeSchema } from "@/lib/zod";
import { createEmployee } from "@/actions/employee";
import Button from "../ui/Button";

const EmployeeForm = ({
  data,
  onClose,
  departments,
}: {
  data?: any;
  onClose: Function;
  departments: {
    name: string;
    category: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof EmployeeSchema>>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      recordNo: "",
      name: "",
      category: "",
      department: "",
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

    try {
      const result = await createEmployee(data);
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
      <h1 className="text-center text-sm font-semibold">Add Employee</h1>
      <InputField
        label="ID Number"
        name="recordNo"
        defaultValue={data?.recordNo}
        register={register}
        error={errors?.recordNo}
      />
      <InputField
        label="Employee Name"
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
          {departments &&
            departments.length > 0 &&
            departments.map((item) => {
              return <option value={item.id}>{item.name}</option>;
            })}
        </select>
        {errors.department?.message && (
          <p className="text-[#ff0000] text-[10px]">
            {errors.department.message.toString()}
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

export default EmployeeForm;
