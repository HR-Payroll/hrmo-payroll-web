"use client";
import React, { useState } from "react";
import { tableStyle } from "@/lib/themes";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { MdDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import Link from "next/link";

function SummaryTable({
  employees,
  departments,
  reload,
}: {
  employees: any[];
  departments: any[];
  reload?: VoidFunction;
}) {
  const [data, setData] = useState(employees);

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
      field: "earnings",
      headerName: "Total Earnings",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "deductions",
      headerName: "Total Deductions",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "income",
      headerName: "NET INCOME",
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
              href={""}
              className="flex items-center justify-center rounded-full bg-[#ECEEF6] hover:bg-blue-200 active:bg-blue-300 active:text-[#0000ff] text-[#333333] p-1 cursor-pointer"
            >
              <MdOutlineRemoveRedEye size={16} />
            </Link>
            <div className="flex items-center justify-center rounded-full bg-[#ECEEF6] hover:bg-blue-200 active:bg-blue-300 active:text-[#0000ff] text-[#333333] p-1 cursor-pointer">
              <MdDeleteOutline size={16} />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowId={(row) => row._id.$oid.toString()}
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

export default SummaryTable;
