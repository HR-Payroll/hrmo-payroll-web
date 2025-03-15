"use client";
import React from "react";
import Link from "next/link";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { MdOutlineRemoveRedEye, MdDeleteOutline } from "react-icons/md";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
};

const DataTable = (props: Props) => {
  const handleDelete = (id: number) => {
    console.log(id + " has been deleted");
  };

  const actionColumn: GridColDef = {
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
            href={`/dashboard/${props.slug}/${params.row.id}`}
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
  };

  return (
    <DataGrid
      rows={props.rows}
      columns={[...props.columns, actionColumn]}
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
      sx={{
        "& .odd-row": {
          backgroundColor: "#F8FAFC",
        },
        "& .custom-header": {
          backgroundColor: "#bfdbfe",
          color: "#000",
          fontWeight: "bold",
          textAlign: "center",
        },
        "& .MuiDataGrid-main": {
          fontFamily: "Inter, sans-serif",
          color: "#333333",
          fontSize: "smaller",
        },
        "& .MuiDataGrid-toolbarContainer": {
          flexDirection: "row-reverse",
        },
        "& .MuiInputBase-input-MuiInput-input": {
          fontFamily: "Inter, sans-serif",
          color: "#333333",
          fontSize: "smaller",
        },
        "& .MuiSvgIcon-root": {
          color: "#9CA3AF",
          fontSize: "16px",
          marginLeft: "5px",
        },
        "& .MuiInputBase-root": {
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
          color: "#6B7280",
        },
        "& .MuiPaginationItem-root.Mui-selected": {
          backgroundColor: "#D0C8FC",
          color: "#000",
        },
        "& .MuiButtonBase-root.Mui-disabled": {
          color: "#ccc",
        },
        "& .MuiTablePagination-root": {
          fontSize: "12px",
          minHeight: "30px",
          fontFamily: "Inter, sans-serif",
          color: "#333",
        },
        "& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel":
          {
            fontSize: "12px",
          },
      }}
    />
  );
};

export default DataTable;
