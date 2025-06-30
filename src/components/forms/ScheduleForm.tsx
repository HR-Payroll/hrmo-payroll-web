"use client";
import { ScheduleSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import TimePickerField from "../TimePickerField";
import { Chip } from "@mui/material";
import Button from "../ui/Button";
import { createSchedule, updateSchedule } from "@/actions/schedule";
import { isArrayEqual } from "@/utils/tools";

function ScheduleForm({
  data,
  onClose,
  setSnackbar,
  edit,
  reload,
}: {
  data?: any;
  onClose: Function;
  setSnackbar: Function;
  edit?: { id: string; data: z.infer<typeof ScheduleSchema> };
  reload?: VoidFunction;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [option, setOption] = useState<"Regular" | "Custom">("Regular");
  const [daysIncluded, setDaysIncluded] = useState<string[]>(
    edit ? edit.data.daysIncluded : []
  );

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<z.infer<typeof ScheduleSchema>>({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: {
      name: edit ? edit.data.name : "",
      inTime: edit ? new Date(edit.data.inTime) : new Date(),
      outTime: edit ? new Date(edit.data.outTime) : new Date(),
      readOnly: false,
      daysIncluded: edit ? edit.data.daysIncluded : [],
    },
  });

  const onSubmit = async (data: z.infer<typeof ScheduleSchema>) => {
    console.log(data);
    setServerError(null);
    setIsAdding(true);

    try {
      if (edit) {
        await updateSchedule(edit.id, data);
        setSnackbar({
          message: "Schedule has been updated successfully!",
          type: "success",
          modal: true,
        });
      } else {
        await createSchedule(data);
        setSnackbar({
          message: "Schedule has been created successfully!",
          type: "success",
          modal: true,
        });
      }

      if (reload) reload();
      setIsAdding(false);
      onClose();
    } catch (error: any) {
      setSnackbar({
        message: error.message,
        type: "error",
        modal: true,
      });
      console.log(error);
      setIsAdding(false);
    }
  };

  useEffect(() => {
    const regularDays = days.filter(
      (day) => day !== "Saturday" && day !== "Sunday"
    );

    if (
      edit?.data.daysIncluded &&
      !isArrayEqual(edit.data.daysIncluded, regularDays)
    ) {
      setOption("Custom");
    }

    if (edit) {
      setValue("inTime", new Date(edit?.data.inTime));
      setValue("outTime", new Date(edit?.data.outTime));
      return;
    }

    setValue("inTime", onChangeTime(data?.inTime, 8));
    setValue("outTime", onChangeTime(data?.outTime, 17));

    if (option === "Regular") setDays(regularDays);
  }, []);

  const setDays = (value: string[]) => {
    setValue("daysIncluded", value, { shouldValidate: true });
    setDaysIncluded(value);
  };

  const onChangeTime = (time?: Date, dt?: number) => {
    const currentDate = new Date();

    if (!time)
      return new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDay(),
        dt || 0,
        0,
        0
      );

    return new Date(
      time.getFullYear(),
      time.getMonth(),
      time.getDay(),
      time.getTime(),
      time.getMinutes(),
      0
    );
  };

  return (
    <form
      className="flex flex-col gap-4 p-4 text-[var(--text)]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-center text-base font-semibold">
        {edit ? "Edit Schedule" : "Add Schedule"}
      </h1>
      <InputField
        label="Schedule Name"
        name="name"
        defaultValue={data?.name}
        register={register}
        error={errors?.name}
      />
      <TimePickerField
        name="inTime"
        label="Time In"
        defaultValue={
          edit ? new Date(edit.data.inTime) : onChangeTime(data?.inTime, 8)
        }
        setValue={setValue}
        error={errors?.inTime}
      />
      <TimePickerField
        name="outTime"
        label="Time Out"
        defaultValue={
          edit ? new Date(edit.data.outTime) : onChangeTime(data?.outTime, 17)
        }
        validator={() => false}
        setValue={setValue}
        error={errors?.outTime}
      />
      <div className="flex flex-col text-sm gap-2 text-[var(--text)]">
        <label className="text-left">Schedule Option</label>
        <div className="flex flex-wrap gap-2">
          {["Regular", "Custom"].map((opt) => (
            <Chip
              key={opt}
              label={opt}
              onClick={() => {
                setOption(opt as "Regular" | "Custom");
                if (opt === "Regular") {
                  const value = days.filter(
                    (day) => day !== "Sunday" && day !== "Saturday"
                  );
                  setDays(value);
                } else {
                  setDays([]);
                }
              }}
              variant={option === opt ? "filled" : "outlined"}
              color="primary"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col text-sm gap-2 text-[var(--text)]">
        <label className="text-left">Included Days</label>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <Chip
              key={day}
              label={day}
              disabled={option === "Regular"}
              onClick={() => {
                const value = daysIncluded.includes(day)
                  ? daysIncluded.filter((d) => d !== day)
                  : [...daysIncluded, day];

                setDays(value);
              }}
              variant={daysIncluded.includes(day) ? "filled" : "outlined"}
              color="primary"
              className="disabled:cursor-not-allowed "
            />
          ))}
        </div>
        {errors?.daysIncluded?.message && (
          <p className="text-red text-xs">
            {errors?.daysIncluded?.message.toString()}
          </p>
        )}
      </div>
      <div className="mt-4">
        <Button
          label={
            isAdding
              ? `${edit ? "Updating" : "Creating"}...`
              : `${edit ? "Update" : "Create"}`
          }
          type="submit"
          isLoading={isAdding}
        />
      </div>
      {serverError && <p style={{ color: "red" }}>{serverError}</p>}
    </form>
  );
}

export default ScheduleForm;
