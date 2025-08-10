"use client";
import { ScheduleSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useReducer, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import TimePickerField from "../TimePickerField";
import { Backdrop, Chip, Radio } from "@mui/material";
import Button from "../ui/Button";
import { createSchedule, updateSchedule } from "@/actions/schedule";
import { isArrayEqual } from "@/utils/tools";
import { MdOutlineClose } from "react-icons/md";
import { DaysKey, ScheduleDay } from "@/types";
import { formatTime } from "@/utils/dateFormatter";

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
  const [selectTime, setSelectTime] = useState<string | null>(null);
  const [daysIncluded, setDaysIncluded] = useState<ScheduleDay[]>(
    edit ? edit.data.daysIncluded : []
  );
  const [regularIn, setRegularIn] = useState<Date>(new Date());
  const [regularOut, setRegularOut] = useState<Date>(new Date());
  const [schedule, setSchedule] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      Sunday: {
        value: 0,
        inTime: regularIn,
        outTime: regularOut,
        included: true,
      },
      Monday: {
        value: 1,
        inTime: regularIn,
        outTime: regularOut,
        included: true,
      },
      Tuesday: {
        value: 2,
        inTime: regularIn,
        outTime: regularOut,
        included: true,
      },
      Wednesday: {
        value: 3,
        inTime: regularIn,
        outTime: regularOut,
        included: true,
      },
      Thursday: {
        value: 4,
        inTime: regularIn,
        outTime: regularOut,
        included: true,
      },
      Friday: {
        value: 5,
        inTime: regularIn,
        outTime: regularOut,
        included: true,
      },
      Saturday: {
        value: 6,
        inTime: regularIn,
        outTime: regularOut,
        included: true,
      },
    }
  );

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
    //const regularDays = days;

    // if (
    //   edit?.data.daysIncluded &&
    //   !isArrayEqual(edit.data.daysIncluded, regularDays)
    // ) {
    //   setOption("Custom");
    // }

    // if (edit) {
    //   setValue("inTime", new Date(edit?.data.inTime));
    //   setValue("outTime", new Date(edit?.data.outTime));
    //   return;
    // }

    setRegularIn(onChangeTime(new Date(), 8));
    setRegularOut(onChangeTime(new Date(), 17));

    setSchedule(
      Object.keys(schedule).reduce((acc, key) => {
        acc[key as DaysKey] = {
          ...schedule[key as DaysKey],
          inTime: onChangeTime(new Date(), 8),
          outTime: onChangeTime(new Date(), 18),
        };
        return acc;
      }, {} as typeof schedule)
    );

    console.log("Schedule initialized", schedule);
    console.log(regularIn, regularOut);
    // if (option === "Regular")
    //   setDays(
    //     regularDays.map((day) => {
    //       return {
    //         label: day.label,
    //         value: day.value,
    //         inTime: onChangeTime(data?.inTime, 8),
    //         outTime: onChangeTime(data?.outTime, 17),
    //       };
    //     })
    //   );
  }, []);

  const setDays = (
    value: { label: string; value: number; inTime: Date; outTime: Date }[]
  ) => {
    setValue("daysIncluded", value, { shouldValidate: true });
    setDaysIncluded(value);
  };

  const onChangeTime = (time?: Date, dt?: number) => {
    const currentDate = new Date();

    if (!time)
      return new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        dt || 0,
        0,
        0
      );

    return new Date(
      time.getFullYear(),
      time.getMonth(),
      time.getDate(),
      dt || time.getHours(),
      dt ? 0 : time.getMinutes(),
      0
    );
  };

  const isDayIncluded = (day: string): boolean => {
    return schedule[day as keyof typeof schedule]?.included || false;
  };

  const inputTimeSelect = () => {
    return (
      <div className="p-4 w-[300px] bg-white rounded-md flex flex-col items-center justify-center gap-2 pb-8">
        <div className="flex flex-row justify-between w-full items-center">
          <div className="flex flex-row items-center">
            <Radio
              checked={isDayIncluded(selectTime || "")}
              onClick={() => {
                setSchedule({
                  [(selectTime as DaysKey) || ""]: {
                    ...schedule[(selectTime as DaysKey) || ""],
                    included: !schedule[(selectTime as DaysKey) || ""].included,
                  },
                });
                setDays(daysIncluded.filter((day) => day.label !== selectTime));
              }}
            />
            <span className="text-[var(--text)] font-medium text-base">
              {selectTime || ""}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectTime(null);
            }}
            className="rounded-full hover:bg-blue-100 active:bg-blue-200 active:text-[var(--accent)] text-[var(--text)] text-base p-2 cursor-pointer"
          >
            <MdOutlineClose />
          </button>
        </div>
        <TimePickerField
          key={`time-in-${selectTime}`}
          name="inTime"
          label="Time In"
          defaultValue={
            selectTime
              ? schedule[selectTime as DaysKey].inTime
              : onChangeTime(new Date(), 8)
          }
          setValue={(_, value) => {
            setSchedule({
              [(selectTime as DaysKey) || ""]: {
                ...schedule[(selectTime as DaysKey) || ""],
                inTime: onChangeTime(new Date(value)),
              },
            });
          }}
          //error={errors?.inTime}
          disabled={!isDayIncluded(selectTime || "")}
        />
        <TimePickerField
          key={`time-out-${selectTime}`}
          name="outTime"
          label="Time Out"
          validator={() => false}
          defaultValue={
            selectTime
              ? schedule[selectTime as DaysKey].outTime
              : onChangeTime(new Date(), 17)
          }
          setValue={(_, value) => {
            setSchedule({
              [(selectTime as DaysKey) || ""]: {
                ...schedule[(selectTime as DaysKey) || ""],
                outTime: onChangeTime(new Date(value)),
              },
            });
          }}
          //error={errors?.outTime}
          disabled={!isDayIncluded(selectTime || "")}
        />
      </div>
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

      <div className="flex flex-col text-sm gap-2 text-[var(--text)]">
        <label className="text-left">Schedule Option</label>
        <div className="flex flex-wrap gap-2">
          {["Regular", "Custom"].map((opt) => (
            <Chip
              key={opt}
              label={opt}
              onClick={() => {
                setOption(opt as "Regular" | "Custom");
                setSchedule(
                  Object.keys(schedule).reduce((acc, key) => {
                    acc[key as DaysKey] = {
                      ...schedule[key as DaysKey],
                      included: opt === "Regular",
                    };
                    return acc;
                  }, {} as typeof schedule)
                );
              }}
              variant={option === opt ? "filled" : "outlined"}
              color="primary"
            />
          ))}
        </div>
      </div>
      {option === "Regular" && (
        <div className="flex flex-col text-sm gap-2 text-[var(--text)]">
          <TimePickerField
            name="inTime"
            label="Time In"
            defaultValue={onChangeTime(regularIn, 8)}
            setValue={setValue}
            // error={errors?.inTime}
          />
          <TimePickerField
            name="outTime"
            label="Time Out"
            defaultValue={onChangeTime(regularOut, 17)}
            validator={() => false}
            setValue={setValue}
            //error={errors?.outTime}
          />
        </div>
      )}
      <div className="flex flex-col text-sm gap-2 text-[var(--text)]">
        <label className="text-left">Included Days</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(schedule).map((day: string) => (
            <button
              onClick={() => {
                setSelectTime(day);
              }}
              type="button"
              disabled={option === "Regular"}
              key={day}
              className={`${
                isDayIncluded(day)
                  ? "border-highlight text-highlight"
                  : " border-gray-200  enabled:hover:bg-gray-100"
              } p-2 disabled:opacity-50 enabled:cursor-pointer border flex flex-col items-start gap-1 rounded-md select-none  active:bg-gray-100`}
            >
              <h1 className="text-sm font-medium">{day}</h1>
              <div className="flex flex-col text-xs items-start">
                <p>
                  In: {formatTime(schedule[day as DaysKey].inTime, "hh:mm aa")}
                </p>
                <p>
                  Out:{" "}
                  {formatTime(schedule[day as DaysKey].outTime, "hh:mm aa")}
                </p>
              </div>
            </button>
          ))}
        </div>
        {/* {errors?.daysIncluded?.message && (
          <p className="text-red text-xs">
            {errors?.daysIncluded?.message.toString()}
          </p>
        )} */}
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

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!!selectTime}
        onClick={() => {
          // setSelectTime(null);
        }}
      >
        {inputTimeSelect()}
      </Backdrop>
    </form>
  );
}

export default ScheduleForm;
