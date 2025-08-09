"use client";
import React, { useEffect } from "react";
import { tableStyle } from "@/lib/themes";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns-tz";
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

  useEffect(() => {
    console.log("ViewReport component mounted with reports:", reports);

    reports?.forEach((report) => {
      console.log("Report Date:", dateTz(report.date));
      console.log("Employee Name:", report.name);
      console.log(
        "Time In 1:",
        report.r1 ? format(report.r1, "hh:mm aa", { timeZone: "UTC" }) : "N/A"
      );
      console.log(
        "Time Out 1:",
        report.r2
          ? format(report.r2, "hh:mm aa", { timeZone: "Asia/Manila" })
          : "N/A"
      );
      console.log(
        "Time In 2:",
        report.r3
          ? format(dateTz(report.r3), "hh:mm aa", { timeZone: "Asia/Manila" })
          : "N/A"
      );
      console.log(
        "Time Out 2:",
        report.r4
          ? format(dateTz(report.r4), "hh:mm aa", { timeZone: "UTC" })
          : "N/A"
      );
    });
  }, [reports]);

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
