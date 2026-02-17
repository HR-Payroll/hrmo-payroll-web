"use client";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material";
import { tableStyle } from "@/lib/themes";
import { updateRate } from "@/actions/rate";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import {
  DataGrid,
  GridColDef,
  GridEditInputCell,
  GridPaginationModel,
  GridPreProcessEditCellProps,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import { MdCheck, MdClose, MdOutlineCreate } from "react-icons/md";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SnackbarInfo, { initialSnackbar } from "../ui/SnackbarInfo";

function CompensationRateTable({
  rates,
  reload,
  loading,
  page = 0,
  limit = 10,
  rowCount = 0,
}: {
  rates?: any[];
  reload?: VoidFunction;
  loading?: boolean;
  page?: number;
  limit?: number;
  rowCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [data, setData] = useState(rates);
  const [isEditing, setEditing] = useState<any>();
  const [pageSize, setPageSize] = useState(limit);
  const [isLoading, setLoading] = useState(loading);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    modal: false,
  });

  useEffect(() => {
    setData(rates);
    setLoading(false);
  }, [rates]);

  const onChangeFilter = (keys: { key: string; value: string }[]) => {
    let path = "";
    const params = Object.fromEntries(searchParams.entries());

    for (const key of keys) {
      if (params[key.key]) delete params[key.key];
      if (key.value) params[key.key] = key.value;
    }

    Object.keys(params).forEach((key, index) => {
      if (index === 0) path += `?${key}=${params[key]}`;
      else path += `&${key}=${params[key]}`;
    });

    router.push(`${pathname}${path}`);
  };

  const onPageChange = (model: GridPaginationModel) => {
    setLoading(true);
    onChangeFilter([
      { key: "page", value: model.page.toString() },
      { key: "limit", value: model.pageSize.toString() },
    ]);
  };

  const columns: GridColDef[] = [
    {
      field: "recordNo",
      headerName: "ID Number",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "name",
      headerName: "Employee Name",
      headerClassName: "custom-header",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "department",
      headerName: "Department",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      editable: false,
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
      editable: false,
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
      field: "rate",
      headerName: "Rate",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const value = params.props.value;
        const hasError =
          value.length < 1 || value === ""
            ? "Please input a valid rate."
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
      field: "type",
      headerName: "Type",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: ["Daily", "Monthly"],
      editable: true,
      valueSetter: (value, row) => {
        const dept = {
          Daily: "DAILY",
          Monthly: "MONTHLY",
        } as any;

        return { ...row, type: dept[value] };
      },
      valueGetter: (row) => {
        const dept = {
          DAILY: "Daily",
          MONTHLY: "Monthly",
        };

        return dept[row];
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
                      (row: any) => row.id === Number(params.id),
                    );

                    onUpdate(Number(params.id), {
                      rate: row.rate,
                      type: row.type,
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
                        row._id.$oid === params.id ? temp[params.id] : row,
                      ),
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
              <div className="w-full flex items-center justify-center p-1 cursor-pointer">
                <MdOutlineCreate
                  size={25}
                  className="w-fit rounded-full bg-[var(--border)] hover:bg-accent-200 active:bg-accent-300 active:text-[var(--accent)] text-[var(--text)] p-1"
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
      rate?: number;
      type?: string;
    },
  ) => {
    try {
      await updateRate(id, payload);
      setSnackbar({
        message: "Employee compensation rate info successfully updated!",
        type: "success",
        modal: true,
      });

      const temp = { ...isEditing };
      delete temp[id];
      setEditing(temp);
      reload && reload();
    } catch (error) {
      setSnackbar({
        message: "Failed to update employee compensation rate!",
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
      prev.map((row: any) => (row.id === Number(params.rowId) ? newRow : row)),
    );

    return { ...newRow, isNew: false };
  };

  return (
    <>
      <DataGrid
        rows={data}
        loading={isLoading}
        columns={columns}
        getRowId={(row) => row.id.toString()}
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

export default CompensationRateTable;
