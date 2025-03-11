"use client";
import { tableStyle } from "@/lib/themes";
import { styled } from "@mui/material";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import {
  DataGrid,
  GridColDef,
  GridEditInputCell,
  GridPreProcessEditCellProps,
  GridRenderEditCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import React from "react";

function CompensationRateTable({
  rates,
  departments,
}: {
  rates: any[];
  departments: any[];
}) {
  const columns: GridColDef[] = [
    {
      field: "recordNo",
      headerName: "ID Number",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Employee Name",
      headerClassName: "custom-header",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
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
      type: "number",
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        console.log(params.props.value);
        const hasError =
          params.props.value < 1 ? "Please input a valid rate." : null;
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
      valueOptions: ["Daily", "Weekly", "Bi-weekly", "Monthly", "Contractual"],
      editable: true,
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

  return (
    <>
      <DataGrid
        rows={rates}
        columns={columns}
        getRowId={(row) => {
          return row._id.$oid.toString();
        }}
        columnHeaderHeight={40}
        rowHeight={36}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 !== 0 ? "odd-row" : ""
        }
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
        processRowUpdate={(row, _, params) => {
          console.log(row, params);
          return { ...row, isNew: false };
        }}
        sx={tableStyle}
      />
    </>
  );
}

export default CompensationRateTable;
