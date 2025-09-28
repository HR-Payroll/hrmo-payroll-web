"use client";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material";
import { tableStyle } from "@/lib/themes";
import { updateMandatory } from "@/actions/mandatory";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import {
  DataGrid,
  GridColDef,
  GridEditInputCell,
  GridPaginationModel,
  GridPreProcessEditCellProps,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import { usePathname, useRouter } from "next/navigation";

function MandatoryDeductionsTable({
  deductions,
  reload,
  loading,
  page = 0,
  limit = 10,
  rowCount = 0,
}: {
  deductions?: any[];
  reload?: VoidFunction;
  loading?: boolean;
  page?: number;
  limit?: number;
  rowCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState(deductions);
  const [isEditing, setEditing] = useState<any>();
  const [pageSize, setPageSize] = useState(limit);
  const [isLoading, setLoading] = useState(loading);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    modal: false,
  });

  useEffect(() => {
    setData(deductions);
    setLoading(false);
  }, [deductions]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Employee Name",
      headerClassName: "custom-header",
      flex: 1.3,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "department",
      headerName: "Department",
      headerClassName: "custom-header",
      flex: 0.7,
      align: "center",
      headerAlign: "center",
      editable: false,
      valueGetter: (value) => {
        return value ? value["name"] : "N/A";
      },
    },
    {
      field: "gsisgs",
      headerName: "GSIS(GS)",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError =
          params.props.value < 1 ? "Please input a valid deduction." : null;
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
      field: "ec",
      headerName: "EC",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError =
          params.props.value < 1 ? "Please input a valid deduction." : null;
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
      field: "gsisps",
      headerName: "GSIS(PS)",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError =
          params.props.value < 1 ? "Please input a valid deduction." : null;
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
      field: "phic",
      headerName: "PHIC",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError =
          params.props.value < 1 ? "Please input a valid deduction." : null;
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
      field: "hdmfgs",
      headerName: "HDMF(GS)",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError =
          params.props.value < 1 ? "Please input a valid deduction." : null;
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
      field: "hdmfps",
      headerName: "HDMF(PS)",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError =
          params.props.value < 1 ? "Please input a valid deduction." : null;
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
      field: "wtax",
      headerName: "WTax",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError =
          params.props.value < 1 ? "Please input a valid deduction." : null;
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
      field: "sss",
      headerName: "SSS",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const hasError =
          params.props.value < 1 ? "Please input a valid deduction." : null;
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
      department?: any;
      gsisgs?: number;
      ec?: number;
      gsisps?: number;
      phic?: number;
      hdmfgs?: number;
      hdmfps?: number;
      wtax?: number;
      sss?: number;
    }
  ) => {
    try {
      await updateMandatory(id, payload);
      setSnackbar({
        message: "Mandatory deduction info successfully updated!",
        type: "success",
        modal: true,
      });

      const temp = { ...isEditing };
      delete temp[id];
      setEditing(temp);
    } catch (error) {
      setSnackbar({
        message: "Failed to update deduction!",
        type: "error",
        modal: true,
      });
    }
  };

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
      prev.map((row: any) => (row.id === Number(params.rowId) ? newRow : row))
    );

    return { ...newRow, isNew: false };
  };

  return (
    <DataGrid
      rows={data}
      loading={isLoading}
      columns={columns}
      getRowId={(row) => row.id.toString()}
      rowCount={rowCount}
      columnHeaderHeight={40}
      rowHeight={36}
      getRowClassName={(params) => {
        if (isEditing && Object.keys(isEditing).includes(params.id as string))
          return "edited-row";
        return params.indexRelativeToCurrentPage % 2 !== 0 ? "odd-row" : "";
      }}
      paginationMode="server"
      paginationModel={{ page, pageSize }}
      pageSizeOptions={[5, 10, 20]}
      disableRowSelectionOnClick
      sx={tableStyle}
      processRowUpdate={processUpdate}
      onPaginationModelChange={(model) => {
        page = model.page;
        setPageSize(model.pageSize);
        onPageChange(model);
      }}
    />
  );
}

export default MandatoryDeductionsTable;
