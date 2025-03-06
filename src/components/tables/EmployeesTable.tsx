"use client";

import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Alert from "../ui/Alert";
import { deleteEmployee } from "@/actions/employee";

function EmployeesTable({
  data,
  reload,
}: {
  data?: any[];
  reload?: VoidFunction;
}) {
  const [isDelete, setDelete] = useState(null);

  const columns: GridColDef[] = [
    {
      field: "recordNo",
      headerName: "ID Number",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "name",
      headerName: "Employee Name",
      headerClassName: "custom-header",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "department",
      headerName: "Department",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: [
        "Accounting Office",
        "Assessor's Office",
        "Consultant's Office",
        "Contractual 20%",
        "Dept. of Agriculture",
      ],
      editable: true,
      valueGetter: (value) => {
        return value["name"];
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
      field: "action",
      headerName: "Action",
      headerClassName: "custom-header",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        return (
          <div
            onClick={() => {
              setDelete(params.id);
            }}
            className="w-full flex items-center justify-center p-1 cursor-pointer"
          >
            <MdDeleteOutline
              size={25}
              className="w-fit rounded-full bg-slate-200 hover:bg-slate-300 active:bg-slate-400 active:text-white text-[#333333] p-1"
            />
          </div>
        );
      },
    },
  ];

  const onDelete = async () => {
    try {
      await deleteEmployee(isDelete!);
      if (reload) reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Alert
        open={!!isDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee?"
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
        getRowId={(row) => row._id.$oid.toString()}
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
    </>
  );
}

export default EmployeesTable;
