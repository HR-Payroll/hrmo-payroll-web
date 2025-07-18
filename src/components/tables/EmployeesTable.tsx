"use client";
import React, { useEffect, useState } from "react";
import Alert from "../ui/Alert";
import { tableStyle } from "@/lib/themes";
import { usePathname, useRouter } from "next/navigation";
import SnackbarInfo, { initialSnackbar } from "../ui/SnackbarInfo";
import { MdDeleteOutline, MdCheck, MdClose } from "react-icons/md";
import { deleteEmployee, updateEmployee } from "@/actions/employee";
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridEditInputCell,
  GridPaginationModel,
  GridPreProcessEditCellProps,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";

function EmployeesTable({
  departments,
  employees,
  schedules,
  reload,
  loading,
  page = 0,
  limit = 10,
  rowCount = 0,
}: {
  departments: any[];
  employees?: any[];
  schedules: any[];
  reload?: VoidFunction;
  loading?: boolean;
  page?: number;
  limit?: number;
  rowCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState(employees);
  const [isDelete, setDelete] = useState(null);
  const [isEditing, setEditing] = useState<any>();
  const [pageSize, setPageSize] = useState(limit);
  const [isLoading, setLoading] = useState(loading);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    modal: false,
  });

  useEffect(() => {
    console.log("EmployeesTable mounted with employees:", employees);
    setData(employees);
    setLoading(false);
  }, [employees]);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  const onPageChange = (model: GridPaginationModel) => {
    let query = pathname;

    if (model.page !== 0 && model.pageSize !== 10) {
      query = `${pathname}?page=${model.page}&limit=${model.pageSize}`;
    } else if (model.page !== 0) {
      query = `${pathname}?page=${model.page}`;
    } else if (model.pageSize !== 10) {
      query = `${pathname}?limit=${model.pageSize}`;
    }

    setLoading(true);
    router.push(query);
  };

  const columns: GridColDef[] = [
    {
      field: "recordNo",
      headerName: "ID Number",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const value = params.props.value;
        const hasError =
          value.length < 1 || value === ""
            ? "Please input a valid ID Number."
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
      field: "name",
      headerName: "Employee Name",
      headerClassName: "custom-header",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const value = params.props.value;
        const hasError =
          value.length < 1 || value === ""
            ? "Please input a valid name."
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
      field: "department",
      headerName: "Department",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: departments.map((item) => item.name) || [],
      editable: true,
      valueSetter: (value, row) => {
        const department = departments.find((dept: any) => dept.name === value);

        return {
          ...row,
          department,
        };
      },
      valueGetter: (value) => {
        return value ? value["name"] : "N/A";
      },
    },
    {
      field: "category",
      headerName: "Category",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: ["Regular", "Casual", "Job Order"],
      editable: true,
      valueSetter: (value, row) => {
        const dept = {
          Regular: "REGULAR",
          Casual: "CASUAL",
          "Job Order": "JOB_ORDER",
        } as any;

        return { ...row, category: dept[value] };
      },
      valueGetter: (row) => {
        const dept = {
          REGULAR: "Regular",
          CASUAL: "Casual",
          JOB_ORDER: "Job Order",
        };

        return dept[row];
      },
    },
    {
      field: "schedule",
      headerName: "Schedule",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: schedules.map((item) => item.name) || [],
      editable: true,
      valueSetter: (value, row) => {
        const schedule = schedules.find((sched: any) => sched.name === value);

        return {
          ...row,
          schedule,
        };
      },
      valueGetter: (value) => {
        return value ? value["name"] : "N/A";
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
                    const row = data?.find(
                      (row: any) => row._id.$oid === params.id
                    );

                    onUpdate(params.id, {
                      recordNo: row.recordNo,
                      name: row.name,
                      category: row.category,
                      department: row.department._id.$oid,
                      schedule: row.schedule._id.$oid,
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
                        row._id.$oid === params.id ? temp[params.id] : row
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
      recordNo?: string;
      name?: string;
      category?: string;
      department?: any;
      schedule?: any;
    }
  ) => {
    try {
      await updateEmployee(id, payload);
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
      await deleteEmployee(isDelete!);
      if (reload) {
        console.log("tae");
        reload();
      }
    } catch (error) {
      setSnackbar({
        message: "Failed to delete employee!",
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
      prev.map((row: any) => (row._id.$oid === params.rowId ? newRow : row))
    );

    return { ...newRow, isNew: false };
  };

  return (
    <>
      <Alert
        open={!!isDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee?"
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
        loading={isLoading}
        columns={columns}
        getRowId={(row) => row._id.$oid.toString()}
        columnHeaderHeight={40}
        rowHeight={36}
        rowCount={rowCount}
        getRowClassName={(params) => {
          if (isEditing && Object.keys(isEditing).includes(params.id as string))
            return "edited-row";

          return params.indexRelativeToCurrentPage % 2 !== 0 ? "odd-row" : "";
        }}
        pageSizeOptions={[5, 10, 20]}
        paginationMode="server"
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          page = model.page;
          setPageSize(model.pageSize);
          onPageChange(model);
        }}
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

export default EmployeesTable;
