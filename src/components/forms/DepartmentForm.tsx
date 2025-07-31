"use client";
import React, { useState } from "react";
import { createDepartment } from "@/actions/department";
import { zodResolver } from "@hookform/resolvers/zod";
import { DepartmentSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Button from "../ui/Button";
import { z } from "zod";

const DepartmentForm = ({
  data,
  onClose,
  setSnackbar,
}: {
  data?: any;
  onClose: Function;
  setSnackbar: Function;
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

    data = {
      ...data,
      index: `${data.name
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")}-${data.category
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")}` as string,
    };

    try {
      const result = await createDepartment(data);
      setIsAdding(false);
      if (result && result.error) {
        setIsAdding(false);
        return setSnackbar({
          message: result.error,
          type: "error",
          modal: true,
        });
      }

      setSnackbar({
        message: result.success,
        type: "success",
        modal: true,
      });
      onClose();
    } catch (error: any) {
      setSnackbar({
        message: error.message,
        type: "error",
        modal: true,
      });
      setIsAdding(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 p-4 text-[var(--text)]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-center text-base font-semibold">Add Department</h1>
      <InputField
        label="Department Name"
        name="name"
        defaultValue={data?.name}
        register={register}
        error={errors?.name}
      />
      <div className="flex flex-col text-sm gap-2">
        <label className="text-left">Category</label>
        <select
          className="w-full bg-transparent rounded-md ring-2 ring-[var(--border)] focus:outline-2 focus:outline-blue-200 p-2"
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
          <p className="text-[var(--error)] text-xs">
            {errors.category.message.toString()}
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

export default DepartmentForm;
