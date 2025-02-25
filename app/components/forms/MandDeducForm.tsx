"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";

const schema = z.object({
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
  employee: z.enum(
    ["CAILING, CHRISTY", "CABELTO, MICHELLE ANN", "VALCURZA, MA. THERESA"],
    {
      message: "*Required",
    }
  ),
  gsisgs: z.string().min(8, { message: "*Required" }),
  ec: z.string().min(8, { message: "*Required" }),
  gsisps: z.string().min(8, { message: "*Required" }),
  phic: z.string().min(8, { message: "*Required" }),
  hdmfgs: z.string().min(8, { message: "*Required" }),
  hdmfps: z.string().min(8, { message: "*Required" }),
  wtax: z.string().min(8, { message: "*Required" }),
  sss: z.string().min(8, { message: "*Required" }),
});

type Inputs = z.infer<typeof schema>;

const MandDeductionForm = ({ data }: { data?: any }) => {
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
      className="h-[500px] flex flex-col gap-4 text-[#333333]"
      onSubmit={onSubmit}
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
        <div className="flex flex-col text-xs gap-2 text-[#333333]">
          <label className="text-left">Employee</label>
          <select
            className="w-full bg-transparent rounded-md ring-2 ring-[#ECEEF6] focus:outline-2 focus:outline-blue-200 p-2"
            {...register("employee")}
            defaultValue={data?.employee}
          >
            <option value="CAILING, CHRISTY">CAILING, CHRISTY</option>
            <option value="CABELTO, MICHELLE ANN">CABELTO, MICHELLE ANN</option>
            <option value="VALCURZA, MA. THERESA">VALCURZA, MA. THERESA</option>
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
        <button className="w-full rounded-md bg-blue-200 hover:bg-blue-300 active:bg-blue-400 active:text-white text-[#0000ff] text-xs mt-2 p-2 cursor-pointer">
          Create
        </button>
      </div>
    </form>
  );
};

export default MandDeductionForm;
