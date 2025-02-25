"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
  deptname: z
    .string()
    .min(3, { message: "Department name must be at least 3 characters long!" })
    .max(20, {
      message: "Department name must be at most 20 characters long!",
    }),
  category: z.enum(["Regular", "Casual", "Job Order"], {
    message: "*Required",
  }),
});

type Inputs = z.infer<typeof schema>;

const DepartmentForm = ({ data }: { data?: any }) => {
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
      <h1 className="text-center text-sm font-semibold">Add Department</h1>
      <InputField
        label="Department Name"
        name="deptname"
        defaultValue={data?.deptname}
        register={register}
        error={errors?.deptname}
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
      <button className="w-full rounded-md bg-blue-200 hover:bg-blue-300 active:bg-blue-400 active:text-white text-[#0000ff] text-xs mt-2 p-2 cursor-pointer">
        Create
      </button>
    </form>
  );
};

export default DepartmentForm;
