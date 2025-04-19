"use client";
import React, { useEffect, useState } from "react";
import { tableStyle } from "@/lib/themes";
import {
  DataGrid,
  GridColDef,
  GridEditInputCell,
  GridPreProcessEditCellProps,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import { format } from "date-fns";
import { getBusinessDays } from "@/utils/holidays";
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md";
import Alert from "../ui/Alert";
import { deleteEvent, updateEvent } from "@/actions/events";
import SnackbarInfo, { initialSnackbar } from "../ui/SnackbarInfo";
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";

function HolidaysEventsTable({
  events,
  reload,
}: {
  events?: any[];
  reload?: VoidFunction;
}) {
  const [data, setData] = useState(events);
  const [isDelete, setDelete] = useState(null);
  const [isEditing, setEditing] = useState<any>();
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    modal: false,
  });

  useEffect(() => {
    setData(events);
  }, [events]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const value = params.props.value;
        const hasError =
          value.length < 1 || value === ""
            ? "Please input a event name."
            : null;
        return { ...params.props, error: hasError };
      },
      renderEditCell: (props: GridRenderEditCellParams) => {
        const { error } = props;

        return (
          <StyledTooltip open={!!error} title={error}>
            <GridEditInputCell {...props} />
          </StyledTooltip>
        );
      },
    },
    {
      field: "startDate",
      headerName: "Date",
      headerClassName: "custom-header",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "date",
      valueFormatter: (params: any) => {
        return params ? format(params, "MMMM dd, yyyy") : "";
      },
    },
    {
      field: "type",
      headerName: "Type",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueOptions: ["public", "optional", "observation", "holiday", "event"],
      type: "singleSelect",
      editable: true,
      valueSetter: (value, row) => {
        return { ...row, type: value };
      },
      valueGetter: (params: string) => {
        return params ? params.toUpperCase() : "";
      },
    },
    {
      field: "applied",
      headerName: "Status",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueOptions: ["include", "exclude"],
      type: "singleSelect",
      editable: true,
      valueSetter: (value, row) => {
        return { ...row, applied: value === "include" ? true : false };
      },
      renderCell: (params: any) => {
        return (
          <p
            className={`${
              params ? "text-green-600" : "text-red-600"
            } text-sm h-full flex items-center justify-center`}
          >
            {params ? "INCLUDED" : "EXCLUDED"}
          </p>
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
          <>
            {isEditing && Object.keys(isEditing).includes(params.id) ? (
              <div className="flex flex-row">
                <div
                  onClick={() => {
                    const row = data?.find((row: any) => row.id === params.id);

                    const startDate = new Date(row.startDate);
                    row.endDate = new Date(
                      startDate.getFullYear(),
                      startDate.getMonth(),
                      startDate.getDate(),
                      23,
                      59,
                      59
                    );

                    onUpdate(params.id, {
                      name: row.name,
                      startDate: startDate,
                      endDate: row.endDate,
                      type: row.type,
                      applied: row.applied,
                    });
                  }}
                  className="w-full flex items-center justify-center p-1 cursor-pointer"
                >
                  <MdCheck
                    size={22}
                    className="w-fit rounded-full bg-[var(--lightcheck)] hover:bg-[var(--check)] text-white p-[2px]"
                  />
                </div>
                <div
                  onClick={() => {
                    const temp = { ...isEditing };
                    setData((prev: any) =>
                      prev.map((row: any) =>
                        row.id === params.id ? temp[params.id] : row
                      )
                    );
                    delete temp[params.id];
                    setEditing(temp);
                  }}
                  className="w-full flex items-center justify-center p-1 cursor-pointer"
                >
                  <MdClose
                    size={22}
                    className="w-fit rounded-full bg-[var(--lightwrong)] hover:bg-[var(--wrong)] text-white p-[2px]"
                  />
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  setDelete(params.id);
                }}
                className="w-full flex items-center justify-center p-1 cursor-pointer"
              >
                <MdDeleteOutline
                  size={25}
                  className="w-fit rounded-full bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] p-1"
                />
              </div>
            )}
          </>
        );
      },
    },
  ];

  const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  }));

  const onUpdate = async (
    id: string,
    payload: {
      name: string;
      startDate: Date;
      endDate: Date;
      type: string;
      applied: boolean;
    }
  ) => {
    try {
      await updateEvent(id, payload);
      setSnackbar({
        message: "Employee info successfully updated!",
        type: "success",
        modal: true,
      });

      const temp = { ...isEditing };
      delete temp[id];
      setEditing(temp);
    } catch (error) {
      setSnackbar({
        message: "Failed to update employee!",
        type: "error",
        modal: true,
      });
    }
  };

  const onDelete = async () => {
    try {
      await deleteEvent(isDelete!);
      if (reload) {
        reload();
      }
    } catch (error) {
      setSnackbar({
        message: "Failed to delete event!",
        type: "error",
        modal: true,
      });
    }
  };

  const processUpdate = async (newRow: any, oldRow: any, params: any) => {
    const isChanged = Object.keys(newRow).some((key) => {
      const newValue = newRow[key];
      const oldValue = oldRow[key];

      if (typeof newValue === "object" && typeof oldValue === "object") {
        return JSON.stringify(newValue) !== JSON.stringify(oldValue);
      }

      return newValue !== oldValue;
    });

    if (
      (isChanged && !isEditing) ||
      (isEditing && !Object.keys(isEditing).includes(params.rowId))
    ) {
      setEditing({ ...isEditing, [params.rowId]: oldRow });
    }

    setData((prev: any) =>
      prev.map((row: any) => (row.id === params.rowId ? newRow : row))
    );

    return { ...newRow, isNew: false };
  };

  return (
    <>
      <Alert
        open={!!isDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
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
        getRowId={(row) => row.id}
        columnHeaderHeight={40}
        rowHeight={36}
        getRowClassName={(params) => {
          if (isEditing && Object.keys(isEditing).includes(params.id as string))
            return "edited-row";

          return params.indexRelativeToCurrentPage % 2 !== 0 ? "odd-row" : "";
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        sx={tableStyle}
        processRowUpdate={processUpdate}
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
    </>
  );
}

export default HolidaysEventsTable;
