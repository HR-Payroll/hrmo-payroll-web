"use client";
import React, { useState } from "react";
import { styled } from "@mui/material";
import { tableStyle } from "@/lib/themes";
import { updateLoan } from "@/actions/loan";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import {
  DataGrid,
  GridColDef,
  GridEditInputCell,
  GridPreProcessEditCellProps,
  GridRenderEditCellParams,
  GridToolbar,
} from "@mui/x-data-grid";

function LoanDeductionsTable({
  employees,
  departments,
  reload,
}: {
  employees: any[];
  departments: any[];
  reload?: VoidFunction;
}) {
  const [isEditing, setEditing] = useState<any>();
  const [data, setData] = useState(employees);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    modal: false,
  });

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Employee Name",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "department",
      headerName: "Department",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: false,
      valueGetter: (value) => {
        return value ? value["name"] : "N/A";
      },
    },
    {
      field: "mplhdmf",
      headerName: "MPL-HDMF",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        console.log(params.props.value);
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
      field: "gfal",
      headerName: "GFAL",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        console.log(params.props.value);
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
      field: "landbank",
      headerName: "Landbank",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        console.log(params.props.value);
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
      field: "cb",
      headerName: "CB",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        console.log(params.props.value);
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
      field: "eml",
      headerName: "EML",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        console.log(params.props.value);
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
      field: "mplgsis",
      headerName: "MPL-GSIS",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        console.log(params.props.value);
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
      field: "tagum",
      headerName: "Tagum Bank",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        console.log(params.props.value);
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
      field: "ucpb",
      headerName: "UCPB",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        console.log(params.props.value);
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
      field: "mpllite",
      headerName: "MPL-Lite",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        console.log(params.props.value);
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
      field: "sb",
      headerName: "SB",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        console.log(params.props.value);
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
    id: string,
    payload: {
      name?: string;
      department?: any;
      mplhdmf?: number;
      gfal?: number;
      landbank?: number;
      cb?: number;
      eml?: number;
      mplgsis?: number;
      tagum?: number;
      ucpb?: number;
      mpllite?: number;
      sb?: number;
    }
  ) => {
    try {
      await updateLoan(id, payload);
      setSnackbar({
        message: "Loan & Other deduction info successfully updated!",
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
    <DataGrid
      rows={data}
      columns={columns}
      getRowId={(row) => row._id.$oid.toString()}
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
      slots={{ toolbar: GridToolbar }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
      pageSizeOptions={[5, 10, 20]}
      disableRowSelectionOnClick
      disableColumnSelector
      disableDensitySelector
      sx={tableStyle}
      processRowUpdate={processUpdate}
    />
  );
}

export default LoanDeductionsTable;
