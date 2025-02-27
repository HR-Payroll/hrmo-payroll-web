"use client";
import React from "react";
import InputField from "../InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  idnum: z.string().min(8, { message: "*Required" }),
  empname: z
    .string()
    .min(3, { message: "Employee name must be at least 3 characters long!" })
    .max(100, {
      message: "Employee name must be at most 20 characters long!",
    }),
  category: z.enum(["Regular", "Casual", "Job Order"], {
    message: "*Required",
  }),
  deptname: z.enum(
    [
      "Accounting Office",
      "Assessor's Office",
      "Consultant's Office",
      "Contractual 20%",
      "Dept. of Agriculture",
    ],
    {
      message: "*Required",
    }
  ),
});

type Inputs = z.infer<typeof schema>;

const EmployeeForm = ({ data }: { data?: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form
      className="flex flex-col gap-4 text-[#333333] p-4"
      onSubmit={onSubmit}
    >
      <h1 className="text-center text-sm font-semibold">Add Employee</h1>
      <InputField
        label="ID Number"
        name="idnum"
        defaultValue={data?.idnum}
        register={register}
        error={errors?.idnum}
      />
      <InputField
        label="Employee Name"
        name="empname"
        defaultValue={data?.empname}
        register={register}
        error={errors?.empname}
      />
      <div className="flex flex-col text-xs gap-2 text-[#333333]">
        <label className="text-left">Category</label>
        <select
          className="w-full bg-transparent rounded-md ring-2 ring-[#ECEEF6] focus:outline-2 focus:outline-blue-200 p-2"
          {...register("category")}
          defaultValue={data?.category}
        >
          <option value="Regular">Regular</option>
          <option value="Casual">Casual</option>
          <option value="Job Order">Job Order</option>
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
          {...register("deptname")}
          defaultValue={data?.deptname}
        >
          <option value="Accounting Office">Accounting Office</option>
          <option value="Assessor's Office">Assessor's Office</option>
          <option value="Consultant's Office">Consultant's Office</option>
          <option value="Contractual 20%">Contractual 20%</option>
          <option value="Dept. of Agriculture">Dept. of Agriculture</option>
        </select>
        {errors.deptname?.message && (
          <p className="text-[#ff0000] text-[10px]">
            {errors.deptname.message.toString()}
          </p>
        )}
      </div>
      <button className="w-full rounded-md bg-blue-200 hover:bg-blue-300 active:bg-blue-400 active:text-white text-[#0000ff] text-xs mt-2 p-2 cursor-pointer">
        Create
      </button>
    </form>
  );
};

export default EmployeeForm;
