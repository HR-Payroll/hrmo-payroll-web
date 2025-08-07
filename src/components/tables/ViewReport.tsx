"use client";
import React from "react";
import { tableStyle } from "@/lib/themes";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { dateTz } from "@/utils/dateFormatter";

function ViewReport({ reports, name }: { reports?: any[]; name: string }) {
  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
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
      valueGetter: (value) => {
        return value["ref"] ? value["name"] : `${value["name"]} (no ref)`;
      },
    },
    {
      field: "r1",
      headerName: "Time In",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: any) => {
        return params ? format(new Date(params), "hh:mm aa") : "";
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
        return params ? format(new Date(params), "hh:mm aa") : "";
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
        return params ? format(new Date(params), "hh:mm aa") : "";
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
        return params ? format(new Date(params), "hh:mm aa") : "";
      },
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
