"use client";
import React, { useEffect, useState } from "react";
import { tableStyle } from "@/lib/themes";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Link from "next/link";
import { format } from "date-fns";

function ReportTable({
  employees,
  departments,
  reload,
  reports,
  from,
  to,
}: {
  employees: any[];
  departments: any[];
  reports: any[];
  reload?: VoidFunction;
  from: Date;
  to: Date;
}) {
  const [data, setData] = useState(reports);

  useEffect(() => {
    setData(reports);
  }, [reports]);

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

        return row ? dept[row] : "N/A";
      },
    },
    {
      field: "numDays",
      headerName: "Number of Days",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "late",
      headerName: "Minutes Late",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
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
          <div className="flex items-center justify-center gap-2 mt-1 text-base">
            <Link
              href={`/dashboard/reports/${params.row.recordNo}?from=${format(
                from,
                "yyyy-MM-dd"
              )}&to=${format(to, "yyyy-MM-dd")}`}
              className="flex items-center justify-center rounded-full bg-[var(--border)] hover:bg-blue-200 active:bg-blue-300 active:text-[var(--accent)] text-[var(--text)] p-1 cursor-pointer"
            >
              <MdOutlineRemoveRedEye size={16} />
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowId={(row) => row.recordNo}
      columnHeaderHeight={40}
      rowHeight={36}
      getRowClassName={(params) => {
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
    />
  );
}

export default ReportTable;
