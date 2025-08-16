"use client";
import { ScheduleSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useReducer, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import TimePickerField from "../TimePickerField";
import { Backdrop, Checkbox, Chip, Radio } from "@mui/material";
import Button from "../ui/Button";
import { createSchedule, updateSchedule } from "@/actions/schedule";
import { isArrayEqual } from "@/utils/tools";
import { MdOutlineClose } from "react-icons/md";
import { DaysKey, Schedule, ScheduleDay } from "@/types";
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
  edit?: { id: string; data: Schedule };
  reload?: VoidFunction;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [option, setOption] = useState<"Regular" | "Custom" | "Straight Time">(
    "Regular"
  );
  const [selectTime, setSelectTime] = useState<string | null>(null);
  const [regularIn, setRegularIn] = useState<Date>(new Date());
  const [regularOut, setRegularOut] = useState<Date>(new Date());
  const [lastType, setLastType] = useState<"IN" | "OUT" | null>(null);
  const [straightTimeRegular, setStraightTimeRegular] =
    useState<boolean>(false);
  const [schedule, setSchedule] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      Sunday: {
        value: 0,
        inTime: regularIn,
        outTime: regularOut,
        included: false,
        type: undefined as "IN" | "OUT" | undefined,
      },
      Monday: {
        value: 1,
        inTime: regularIn,
        outTime: regularOut,
        included: true,
        type: undefined as "IN" | "OUT" | undefined,
      },
      Tuesday: {
        value: 2,
        inTime: regularIn,
        outTime: regularOut,
        included: true,
        type: undefined as "IN" | "OUT" | undefined,
      },
      Wednesday: {
        value: 3,
        inTime: regularIn,
        outTime: regularOut,
        included: true,
        type: undefined as "IN" | "OUT" | undefined,
      },
      Thursday: {
        value: 4,
        inTime: regularIn,
        outTime: regularOut,
        included: true,
        type: undefined as "IN" | "OUT" | undefined,
      },
      Friday: {
        value: 5,
        inTime: regularIn,
        outTime: regularOut,
        included: true,
        type: undefined as "IN" | "OUT" | undefined,
      },
      Saturday: {
        value: 6,
        inTime: regularIn,
        outTime: regularOut,
        included: false,
        type: undefined as "IN" | "OUT" | undefined,
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
      daysIncluded: edit ? JSON.stringify(edit.data.daysIncluded) : "",
      option: edit ? edit.data.option : "Regular",
      straightTimeRegular: edit ? edit.data.straightTimeRegular : false,
    },
  });

  const onSubmit = async (data: z.infer<typeof ScheduleSchema>) => {
    const scheduleData = {
      ...data,
      option,
    };
    setServerError(null);
    setIsAdding(true);

    try {
      if (edit) {
        await updateSchedule(edit.id, scheduleData);
        setSnackbar({
          message: "Schedule has been updated successfully!",
          type: "success",
          modal: true,
        });
      } else {
        await createSchedule(scheduleData);
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
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (edit) {
      const days = edit.data.daysIncluded;
      const opt = edit.data.option as "Regular" | "Custom" | "Straight Time";
      setOption(opt);

      if (opt === "Regular") {
        const regIn = new Date((days[0] as ScheduleDay).inTime);
        const regOut = new Date((days[0] as ScheduleDay).outTime);
        setRegularIn(regIn);
        setRegularOut(regOut);

        setRegularTime("inTime", regIn);
        setRegularTime("outTime", regOut);
      } else {
        setSchedule(
          Object.keys(schedule).reduce((acc, key) => {
            const isIncluded =
              Array.isArray(days) &&
              days.some((d: any) => d.value === schedule[key as DaysKey].value);
            const matchedDay = isIncluded
              ? days.find(
                  (d: any) => d.value === schedule[key as DaysKey].value
                )
              : null;
            acc[key as DaysKey] = {
              ...schedule[key as DaysKey],
              inTime: matchedDay
                ? new Date(matchedDay.inTime)
                : onChangeTime(new Date(), 8),
              outTime: matchedDay
                ? new Date(matchedDay.outTime)
                : onChangeTime(new Date(), 17),
              included: isIncluded,
              type: opt === "Straight Time" ? matchedDay?.type : undefined,
            };
            return acc;
          }, {} as typeof schedule)
        );
      }

      return;
    }

    setRegularIn(onChangeTime(new Date(), 8));
    setRegularOut(onChangeTime(new Date(), 17));

    setSchedule(
      Object.keys(schedule).reduce((acc, key) => {
        acc[key as DaysKey] = {
          ...schedule[key as DaysKey],
          inTime: onChangeTime(new Date(), 8),
          outTime: onChangeTime(new Date(), 17),
        };
        return acc;
      }, {} as typeof schedule)
    );
  }, []);

  useEffect(() => {
    const scheds = Object.keys(schedule)
      .map((key: string) => schedule[key as DaysKey])
      .filter((item) => item.included) as any;

    setValue("daysIncluded", JSON.stringify(scheds), { shouldValidate: true });
  }, [schedule]);

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

  const numDaysIncluded = () =>
    Object.values(schedule).filter((day) => day.included).length;

  const isDayTypeDisabled = (item: "IN" | "OUT") => {
    return (
      !isDayIncluded(selectTime || "") ||
      (numDaysIncluded() > 0 &&
        isDayIncluded(selectTime || "") &&
        lastType === item)
    );
  };

  const setRegularTime = (field: "inTime" | "outTime", time: Date) => {
    setSchedule(
      Object.keys(schedule).reduce((acc, key) => {
        acc[key as DaysKey] = {
          ...schedule[key as DaysKey],
          included: !["Sunday", "Saturday"].includes(key),
          [field]: onChangeTime(time),
        };
        return acc;
      }, {} as typeof schedule)
    );
  };

  const inputTimeSelect = () => {
    return (
      <div className="p-4 w-[300px] bg-white rounded-md flex flex-col items-center justify-center gap-2 pb-8">
        <div className="flex flex-row justify-between w-full items-center">
          <div className="flex flex-row items-center">
            <Checkbox
              checked={isDayIncluded(selectTime || "")}
              onClick={() => {
                setSchedule({
                  [(selectTime as DaysKey) || ""]: {
                    ...schedule[(selectTime as DaysKey) || ""],
                    included: !schedule[(selectTime as DaysKey) || ""].included,
                  },
                });
                //setDays(daysIncluded.filter((day) => day.label !== selectTime));
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

  const inputStraightTimeSelect = () => {
    return (
      <div className="p-4 w-[300px] bg-white rounded-md flex flex-col items-center justify-center gap-2 pb-8">
        <div className="flex flex-row justify-between w-full items-center">
          <div className="flex flex-row items-center">
            <Checkbox
              checked={isDayIncluded(selectTime || "")}
              onClick={() => {
                setSchedule({
                  [(selectTime as DaysKey) || ""]: {
                    ...schedule[(selectTime as DaysKey) || ""],
                    included: !schedule[(selectTime as DaysKey) || ""].included,
                    type: !schedule[(selectTime as DaysKey) || ""].included
                      ? schedule[(selectTime as DaysKey) || ""].type
                      : undefined,
                  },
                });
                //setDays(daysIncluded.filter((day) => day.label !== selectTime));
              }}
            />
            <span className="text-[var(--text)] font-medium text-base">
              {selectTime || ""}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const type = schedule[selectTime as DaysKey].type;
              if (type === "IN" || type === "OUT") setLastType(type);
              else schedule[selectTime as DaysKey].included = false;
              setSelectTime(null);
            }}
            className="rounded-full hover:bg-blue-100 active:bg-blue-200 active:text-[var(--accent)] text-[var(--text)] text-base p-2 cursor-pointer"
          >
            <MdOutlineClose />
          </button>
        </div>

        <div className="flex flex-col w-full h-full text-[var(--text)] gap-1">
          <p className="pb-2 text-sm font-medium px-3">Any time of the day.</p>
          <div className="flex flex-row items-center gap-8  w-full h-full">
            {["IN", "OUT"].map((item) => (
              <div key={item} className="flex flex-row items-center">
                <Radio
                  checked={
                    isDayIncluded(selectTime || "") &&
                    schedule[selectTime as DaysKey].type === item
                  }
                  //disabled={isDayTypeDisabled(item as "IN" | "OUT")}
                  onClick={() => {
                    setSchedule({
                      [(selectTime as DaysKey) || ""]: {
                        ...schedule[(selectTime as DaysKey) || ""],
                        type: item as "IN" | "OUT",
                      },
                    });
                  }}
                />
                <p
                  className={`${
                    isDayTypeDisabled(item as "IN" | "OUT") && "text-gray-400"
                  } text-center text-base font-medium `}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
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
        <div className="flex flex-wrap gap-2 items-center">
          {["Regular", "Custom", "Straight Time"].map((opt) => (
            <Chip
              key={opt}
              label={opt}
              onClick={() => {
                setOption(opt as "Regular" | "Custom" | "Straight Time");
                setSchedule(
                  Object.keys(schedule).reduce((acc, key) => {
                    acc[key as DaysKey] = {
                      ...schedule[key as DaysKey],
                      included:
                        opt === "Regular" &&
                        !["Sunday", "Saturday"].includes(key),
                      inTime: onChangeTime(regularIn),
                      outTime: onChangeTime(regularOut),
                    };
                    return acc;
                  }, {} as typeof schedule)
                );
              }}
              variant={option === opt ? "filled" : "outlined"}
              color="primary"
            />
          ))}
          {option === "Straight Time" && (
            <div className="flex flex-row items-center">
              <Checkbox
                checked={straightTimeRegular}
                onClick={() => {
                  setValue("straightTimeRegular", !straightTimeRegular);
                  setStraightTimeRegular(!straightTimeRegular);
                }}
              />
              <p className="text-sm">Regular</p>
            </div>
          )}
        </div>
      </div>
      {option === "Regular" && (
        <div className="flex flex-col text-sm gap-2 text-[var(--text)]">
          <TimePickerField
            key={`regular-in-time`}
            name="inTime"
            label="Time In"
            defaultValue={regularIn}
            setValue={(_, value) => {
              setRegularIn(value);
              setRegularTime("inTime", value);
            }}
          />
          <TimePickerField
            key={`regular-out-time`}
            name="outTime"
            label="Time Out"
            defaultValue={regularOut}
            validator={() => false}
            setValue={(_, value) => {
              setRegularOut(value);
              setRegularTime("outTime", value);
            }}
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
              disabled={
                option === "Regular" ||
                (option === "Straight Time" &&
                  (() => {
                    const includedIndices = Object.keys(schedule)
                      .map((d, idx) =>
                        schedule[d as DaysKey].included ? idx : -1
                      )
                      .filter((idx) => idx !== -1)
                      .sort((a, b) => a - b);

                    if (includedIndices.length < 2) return false;
                    const dayIdx = Object.keys(schedule).indexOf(day);
                    return (
                      dayIdx > includedIndices[0] &&
                      dayIdx < includedIndices[includedIndices.length - 1]
                    );
                  })())
              }
              key={day}
              className={`${
                isDayIncluded(day)
                  ? "border-highlight text-highlight"
                  : " border-gray-200  enabled:hover:bg-gray-100"
              } p-2 disabled:opacity-50 enabled:cursor-pointer border flex flex-col items-start gap-1 rounded-md select-none  active:bg-gray-100`}
            >
              {option !== "Straight Time" ? (
                <>
                  <h1 className="text-sm font-medium">{day}</h1>
                  <div className="flex flex-col text-xs items-start">
                    <p>
                      In:{" "}
                      {formatTime(schedule[day as DaysKey].inTime, "hh:mm aa")}
                    </p>
                    <p>
                      Out:{" "}
                      {formatTime(schedule[day as DaysKey].outTime, "hh:mm aa")}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-row items-center justify-center min-w-[90px] gap-1">
                  <h1 className="text-sm font-medium">{day}:</h1>
                  <p className="text-sm font-bold">
                    {schedule[day as DaysKey].included
                      ? schedule[day as DaysKey].type
                      : "N/A"}
                  </p>
                </div>
              )}
            </button>
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

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!!selectTime}
        onClick={() => {
          // setSelectTime(null);
        }}
      >
        {option === "Custom" ? inputTimeSelect() : inputStraightTimeSelect()}
      </Backdrop>
    </form>
  );
}

export default ScheduleForm;
