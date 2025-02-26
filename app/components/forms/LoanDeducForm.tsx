"use client";
import React from "react";
import InputField from "../InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  mplhdmf: z.string().min(8, { message: "*Required" }),
  gfal: z.string().min(8, { message: "*Required" }),
  landbank: z.string().min(8, { message: "*Required" }),
  cb: z.string().min(8, { message: "*Required" }),
  eml: z.string().min(8, { message: "*Required" }),
  mplgsis: z.string().min(8, { message: "*Required" }),
  tagum: z.string().min(8, { message: "*Required" }),
  ucpb: z.string().min(8, { message: "*Required" }),
  mpllite: z.string().min(8, { message: "*Required" }),
  sb: z.string().min(8, { message: "*Required" }),
});

type Inputs = z.infer<typeof schema>;

const LoanDeductionForm = ({ data }: { data?: any }) => {
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
        Add Loan and Other Deductions
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
        <button className="w-full rounded-md bg-blue-200 hover:bg-blue-300 active:bg-blue-400 active:text-white text-[#0000ff] text-xs mt-2 p-2 cursor-pointer">
          Create
        </button>
      </div>
    </form>
  );
};

export default LoanDeductionForm;
