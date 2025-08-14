"use client";
import React, { useEffect, useState } from "react";
import { tableStyle } from "@/lib/themes";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  MdCheck,
  MdClose,
  MdDeleteOutline,
  MdOutlineClose,
  MdOutlineEdit,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import Link from "next/link";
import { format, set } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Box, Chip } from "@mui/material";
import Alert from "../ui/Alert";
import SnackbarInfo, { initialSnackbar } from "../ui/SnackbarInfo";
import { deleteSchedule } from "@/actions/schedule";
import ScheduleForm from "../forms/ScheduleForm";
import { ScheduleSchema } from "@/lib/zod";
import { z } from "zod";
import { formatTime } from "@/utils/dateFormatter";
import { Schedule } from "@/types";

function WorkSchedulesTable({
  schedules,
  reload,
  page = 0,
  limit = 10,
  rowCount = 0,
}: {
  schedules: any[];
  reload?: VoidFunction;
  page?: number;
  limit?: number;
  rowCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState(limit);
  const [isEditing, setEditing] = useState<{
    id: string;
    data: Schedule;
  } | null>(null);
  const [isDelete, setDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    modal: false,
  });

  const days: Record<number, string> = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  useEffect(() => {
    const sched = schedules.map((item) => {
      return { ...item, daysIncluded: JSON.parse(item.daysIncluded) };
    });

    const formattedSched = sched.map((item) => {
      return {
        ...item,
        inTime:
          item.option === "Regular"
            ? formatTime(new Date(item.daysIncluded[0].inTime), " hh:mm aa")
            : item.option === "Custom"
            ? item.daysIncluded
                .map((day: any) =>
                  formatTime(new Date(day.inTime), " hh:mm aa")
                )
                .toString()
            : item.daysIncluded
                .filter((day: any) => day.type === "IN")
                .map((day: any) => ` ${days[day.value]}`),
        outTime:
          item.option === "Regular"
            ? formatTime(new Date(item.daysIncluded[0].outTime), " hh:mm aa")
            : item.option === "Custom"
            ? item.daysIncluded
                .map((day: any) =>
                  formatTime(new Date(day.outTime), " hh:mm aa")
                )
                .toString()
            : item.daysIncluded
                .filter((day: any) => day.type === "OUT")
                .map((day: any) => ` ${days[day.value]}`),
      };
    });

    setData(formattedSched);
  }, [schedules]);

  const onChangeFilter = (key: string, value: string) => {
    let path = "";
    const params = Object.fromEntries(searchParams.entries());

    if (params[key]) delete params[key];
    if (value) params[key] = value;

    Object.keys(params).forEach((key, index) => {
      if (index === 0) path += `?${key}=${params[key]}`;
      else path += `&${key}=${params[key]}`;
    });

    router.push(`${pathname}${path}`);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Schedule",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "inTime",
      headerName: "Time In",
      headerClassName: "custom-header",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "outTime",
      headerName: "Time Out",
      headerClassName: "custom-header",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "daysIncluded",
      headerName: "Included Days",
      headerClassName: "custom-header",
      cellClassName: "rendering-zone",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      editable: false,
      renderCell: (params: any) => {
        console.log(params);
        return (
          <div className="flex flex-row items-center justify-center gap-1 h-full">
            {params.value.map((day: any) => (
              <Chip
                key={day.value}
                label={days[day.value].slice(0, 3)}
                size="small"
                variant="outlined"
              />
            ))}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        return (
          <div className="flex flex-row items-center justify-center w-full gap-1">
            <button
              title={params.row.readOnly ? "Not allowed" : "Edit Schedule"}
              disabled={params.row.readOnly}
              onClick={() => {
                onUpdate(params.id);
              }}
              className="flex items-center justify-center p-1 cursor-pointer"
            >
              <MdOutlineEdit
                size={25}
                className={`${
                  params.row.readOnly
                    ? "cursor-not-allowed"
                    : "hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] "
                } w-fit rounded-full bg-[var(--border)] disabled:cursor-not-allowed text-[var(--text)] p-1`}
              />
            </button>
            <button
              title={params.row.readOnly ? "Not allowed" : "Delete Schedule"}
              disabled={params.row.readOnly}
              onClick={() => {
                setDelete(params.id);
              }}
              className="flex items-center justify-center p-1 cursor-pointer"
            >
              <MdDeleteOutline
                size={25}
                className={`${
                  params.row.readOnly
                    ? "cursor-not-allowed"
                    : "hover:bg-red-200 active:bg-red-300 active:text-[var(--accent)] "
                } w-fit rounded-full bg-[var(--border)] disabled:cursor-not-allowed text-[var(--text)] p-1`}
              />
            </button>
          </div>
        );
      },
    },
  ];

  const onDelete = async () => {
    try {
      await deleteSchedule(isDelete!);
      if (reload) {
        reload();
      }
    } catch (error) {
      setSnackbar({
        message: "Failed to delete schedule!",
        type: "error",
        modal: true,
      });
    }
  };

  const onUpdate = async (id: string) => {
    const schedule = data.find((item) => item._id.$oid === id);
    if (!schedule) return;

    setEditing({
      id,
      data: {
        ...schedule,
        inTime: schedule.inTime.$date,
        outTime: schedule.outTime.$date,
      },
    });
  };

  return (
    <>
      <Alert
        open={!!isDelete}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule?"
        onClose={() => {
          setDelete(null);
        }}
        buttons={[
          {
            label: "Delete",
            onClick: () => {
              onDelete();
              setDelete(null);
            },
          },
          {
            label: "Cancel",
            onClick: () => {
              setDelete(null);
            },
          },
        ]}
      />
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row._id.$oid}
        columnHeaderHeight={40}
        rowHeight={36}
        rowCount={rowCount}
        getRowClassName={(params) => {
          return params.indexRelativeToCurrentPage % 2 !== 0 ? "odd-row" : "";
        }}
        pageSizeOptions={[5, 10, 20]}
        paginationMode="server"
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model: any) => {
          page = model.page;
          setPageSize(model.pageSize);

          let key = Object.keys(model)[0] as string;
          onChangeFilter(key === "pageSize" ? "limit" : key, model[key]);
        }}
        disableRowSelectionOnClick
        sx={tableStyle}
      />
      {snackbar.modal && (
        <SnackbarInfo
          isOpen={snackbar.modal}
          type={snackbar.type as any}
          message={snackbar.message}
          onClose={() => {
            setSnackbar(initialSnackbar);
          }}
        />
      )}
      {isEditing && (
        <div className="h-full w-full fixed top-0 left-0 bg-radial from-blue-500/50 from-5% to-transparent to-80% z-50 flex items-center justify-center overflow-auto">
          <div className="relative w-[70%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[40%] 2xl:w-[30%] bg-white rounded-md border-2 border-[var(--border)] p-4">
            <ScheduleForm
              onClose={() => {
                setEditing(null);
              }}
              setSnackbar={setSnackbar}
              edit={isEditing}
              reload={() => {
                if (reload) reload();
              }}
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setEditing(null)}
                className="rounded-full hover:bg-blue-100 active:bg-blue-200 active:text-[var(--accent)] text-[var(--text)] text-base p-2 cursor-pointer"
              >
                <MdOutlineClose />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WorkSchedulesTable;
