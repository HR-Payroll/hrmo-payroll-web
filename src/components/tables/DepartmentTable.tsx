"use client";
import React, { useEffect, useState } from "react";
import Alert from "../ui/Alert";
import { tableStyle } from "@/lib/themes";
import { usePathname, useRouter } from "next/navigation";
import SnackbarInfo, { initialSnackbar } from "../ui/SnackbarInfo";
import { MdDeleteOutline, MdCheck, MdClose } from "react-icons/md";
import { deleteDepartment, updateDepartment } from "@/actions/department";
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridEditInputCell,
  GridPaginationModel,
  GridPreProcessEditCellProps,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";

function DepartmentTable({
  departments,
  reload,
  isLoading,
  page = 0,
  limit = 10,
  rowCount = 0,
}: {
  departments?: any[];
  reload?: VoidFunction;
  isLoading?: boolean;
  page?: number;
  limit?: number;
  rowCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState(departments);
  const [isDelete, setDelete] = useState(null);
  const [isEditing, setEditing] = useState<any>();
  const [pageSize, setPageSize] = useState(limit);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    modal: false,
  });

  useEffect(() => {
    setData(departments);
  }, [departments]);

  const onPageChange = (model: GridPaginationModel) => {
    let query = pathname;

    if (model.page !== 0 && model.pageSize !== 10) {
      query = `${pathname}?page=${model.page}&limit=${model.pageSize}`;
    } else if (model.page !== 0) {
      query = `${pathname}?page=${model.page}`;
    } else if (model.pageSize !== 10) {
      query = `${pathname}?limit=${model.pageSize}`;
    }

    router.push(query);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Department Name",
      headerClassName: "custom-header",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const value = params.props.value;
        const hasError =
          value.length < 1 || value === ""
            ? "Please input a valid department name."
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
      field: "_count",
      headerName: "Total Employees",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
      valueGetter: (params: any) => {
        return params.employees || 0;
      },
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
      renderCell: (params) => {
        if (!params.value) return "N/A";
        return new Date(params.value).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
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
                      name: row.name,
                      category: row.category,
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
    id: number,
    payload: {
      name?: string;
      category?: string;
    }
  ) => {
    try {
      await updateDepartment(id, payload);
      setSnackbar({
        message: "Department info successfully updated!",
        type: "success",
        modal: true,
      });

      const temp = { ...isEditing };
      delete temp[id];
      setEditing(temp);
    } catch (error) {
      setSnackbar({
        message: "Failed to update department!",
        type: "error",
        modal: true,
      });
    }
  };

  const onDelete = async () => {
    try {
      await deleteDepartment(isDelete!);
      if (reload) reload();
    } catch (error) {
      setSnackbar({
        message: "Failed to delete department!",
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
        title="Delete Department"
        message="Are you sure you want to delete this department?"
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
        loading={isLoading}
        getRowId={(row) => row.id}
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

export default DepartmentTable;
