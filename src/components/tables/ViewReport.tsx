"use client";
import React, { useEffect } from "react";
import { tableStyle } from "@/lib/themes";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatTime } from "@/utils/dateFormatter";

function ViewReport({ reports, name }: { reports?: any[]; name: string }) {
  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: any) => {
        return params ? formatTime(params, "yyyy-MM-dd - EEE") : "";
      },
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
      field: "r1",
      headerName: "Time In",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: any) => {
        return params ? formatTime(params, "hh:mm a") : "";
      },
    },
    {
      field: "r2",
      headerName: "Time Out",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: any) => {
        return params ? formatTime(params, "hh:mm a") : "";
      },
    },
    {
      field: "r3",
      headerName: "Time In",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: any) => {
        return params ? formatTime(params, "hh:mm a") : "";
      },
    },
    {
      field: "r4",
      headerName: "Time Out",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: any) => {
        return params ? formatTime(params, "hh:mm a") : "";
      },
    },
    {
      field: "remarks",
      headerName: "Remarks",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <DataGrid
      rows={reports}
      columns={columns}
      getRowId={(row) => row.date}
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
      pageSizeOptions={[5, 10, 20]}
      disableRowSelectionOnClick
      sx={tableStyle}
    />
  );
}

export default ViewReport;
