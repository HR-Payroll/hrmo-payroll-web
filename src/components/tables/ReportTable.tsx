"use client";
import React from "react";
import Link from "next/link";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { MdOutlineRemoveRedEye, MdDeleteOutline } from "react-icons/md";
import { tableStyle } from "@/lib/themes";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
};

const DataTable = ({ reports }: { reports: any[] }) => {
  const handleDelete = (id: number) => {
    console.log(id + " has been deleted");
  };

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
    },
    {
      field: "category",
      headerName: "Category",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "numDays",
      headerName: "Number of Days",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "late",
      headerName: "Minutes Late",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center gap-2 mt-1 text-base">
            <Link
              href={`/dashboard/reports/${params.row.recordNo}`}
              className="flex items-center justify-center rounded-full bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] p-1 cursor-pointer"
            >
              <MdOutlineRemoveRedEye size={16} />
            </Link>
            <div
              onClick={() => handleDelete(params.row.id)}
              className="flex items-center justify-center rounded-full bg-[#ECEEF6] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] p-1 cursor-pointer"
            >
              <MdDeleteOutline size={16} />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <DataGrid
      rows={reports}
      columns={columns}
      columnHeaderHeight={40}
      rowHeight={36}
      getRowId={(row) => row.recordNo}
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
      sx={tableStyle}
    />
  );
};

export default DataTable;
