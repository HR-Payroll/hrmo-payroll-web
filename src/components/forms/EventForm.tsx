"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Button from "../ui/Button";
import { z } from "zod";
import { createEvent } from "@/actions/events";

const EventForm = ({ data, onClose }: { data?: any; onClose: Function }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: new Date(),
      type: "PUBLIC",
      applied: true,
    },
  });

  const TYPE_OPTIONS: Record<string, string> = {
    public: "PUBLIC",
    optional: "OPTIONAL",
    event: "EVENT",
    observation: "OBSERVATION",
    holiday: "HOLIDAY",
  };

  const onSubmit = async (data: z.infer<typeof EventSchema>) => {
    setServerError(null);
    setIsAdding(true);

    try {
      const startDate = new Date(data.startDate);
      data.endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        23,
        59,
        59
      );

      await createEvent({ ...data, startDate, index: startDate.toISOString() });
      setIsAdding(false);
      onClose();
    } catch (error) {
      console.log(error);
      setIsAdding(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 p-4 text-[var(--text)]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-center text-base font-semibold">Add Event</h1>
      <InputField
        label="Event Name"
        name="name"
        defaultValue={data?.name}
        register={register}
        error={errors?.name}
      />
      <InputField
        label="Date"
        name="startDate"
        type="date"
        defaultValue={data?.startDate}
        register={register}
        error={errors?.startDate}
      />
      <div className="flex flex-col text-sm gap-2">
        <label className="text-left">Type</label>
        <select
          className="w-full bg-transparent rounded-md ring-2 ring-[var(--border)] focus:outline-2 focus:outline-blue-200 p-2"
          {...register("type")}
        >
          {Object.keys(TYPE_OPTIONS).map((key: string) => {
            return (
              <option key={key} value={TYPE_OPTIONS[key]}>
                {key}
              </option>
            );
          })}
        </select>
        {errors.type?.message && (
          <p className="text-[var(--error)] text-xs">
            {errors.type.message.toString()}
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

export default EventForm;
