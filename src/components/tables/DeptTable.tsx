"use client";
import React, { useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { deleteDepartment } from "@/actions/department";
import { MdDeleteOutline } from "react-icons/md";
import Alert from "../ui/Alert";

const DataTable = ({ data, reload }: { data: any[]; reload: VoidFunction }) => {
  const [isDelete, setDelete] = useState(null);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Department Name",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
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
      editable: true,
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
      field: "employees",
      headerName: "Total Employees",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (!params.value) return "N/A";
        return new Date(params.value.$date).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      },
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "custom-header",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        return (
          <div
            onClick={() => {
              setDelete(params.id);
            }}
            className="flex items-center justify-center rounded-full hover:text-[#0000ff] active:text-blue-200 text-[#333333] p-1 mt-1 cursor-pointer"
          >
            <MdDeleteOutline size={16} />
          </div>
        );
      },
    },
  ];

  const onDelete = async () => {
    try {
      await deleteDepartment(isDelete!);
      reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Alert
        open={!!isDelete}
        title="Delete Department"
        message="Are you sure you want to delete this department?"
        onClose={() => {
          setDelete(null);
        }}
        buttons={[
          {
            label: "Delete",
            onClick: () => {
              onDelete();
              setDelete(null);
            },
          },
          {
            label: "Cancel",
            onClick: () => {
              setDelete(null);
            },
          },
        ]}
      />
      <DataGrid
        rows={data}
        columns={columns}
        columnHeaderHeight={40}
        getRowId={(row) => row._id.$oid.toString()}
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
    </>
  );
};

export default DataTable;
