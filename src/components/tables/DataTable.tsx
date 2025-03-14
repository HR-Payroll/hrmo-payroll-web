"use client";
import React from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { MdDeleteOutline } from "react-icons/md";
import { tableStyle } from "@/lib/themes";

type Props = {
  columns: GridColDef[];
  rows?: any[];
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
        <div
          onClick={() => handleDelete(params.row.id)}
          className="w-full flex items-center justify-center p-1 cursor-pointer"
        >
          <MdDeleteOutline
            size={25}
            className="w-fit rounded-full bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] p-1"
          />
        </div>
      );
    },
  };

  return (
    <DataGrid
      rows={props.rows}
      columns={[...props.columns, actionColumn]}
      getRowId={(row) => row._id.toString()}
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
      sx={tableStyle}
    />
  );
};

export default DataTable;
