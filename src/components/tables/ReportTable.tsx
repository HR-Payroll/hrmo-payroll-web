"use client";
import React, { useEffect, useState } from "react";
import { tableStyle } from "@/lib/themes";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function ReportTable({
  employees,
  departments,
  reload,
  reports,
  from,
  to,
  page = 0,
  limit = 10,
  rowCount = 0,
}: {
  employees: any[];
  departments: any[];
  reports: any[];
  reload?: VoidFunction;
  from: Date;
  to: Date;
  page?: number;
  limit?: number;
  rowCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [data, setData] = useState(reports);
  const [paginationModel, setPaginationModel] = useState({
    page: page,
    pageSize: 10,
  });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setPaginationModel({ page, pageSize: 10 });
  }, [page]);

  useEffect(() => {
    setData(reports);
    setLoading(false);
  }, [reports]);

  const onPageChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    onChangeFilter([
      { key: "page", value: model.page.toString() },
      { key: "limit", value: model.pageSize.toString() },
    ]);
    setLoading(true);
  };

  const onChangeFilter = (keys: { key: string; value: string }[]) => {
    let path = "";
    const params = Object.fromEntries(searchParams.entries());

    for (const key of keys) {
      if (params[key.key]) delete params[key.key];
      if (key.value) params[key.key] = key.value;
    }

    Object.keys(params).forEach((key, index) => {
      if (index === 0) path += `?${key}=${params[key]}`;
      else path += `&${key}=${params[key]}`;
    });

    router.push(`${pathname}${path}`);
  };

  const generateLink = (recordNo: string): string => {
    let url = `/dashboard/reports/${recordNo}`;
    const params = Object.fromEntries(searchParams.entries());

    Object.keys(params).forEach((key, index) => {
      if (index === 0) url += `?${key}=${params[key]}`;
      else url += `&${key}=${params[key]}`;
    });

    return url;
  };

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
      valueGetter: (value: any) => {
        if (!value) return "N/A";
        return value.name;
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
              href={generateLink(params.row.recordNo)}
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
      loading={isLoading}
      columns={columns}
      getRowId={(row) => row.recordNo}
      columnHeaderHeight={40}
      rowHeight={36}
      rowCount={rowCount}
      getRowClassName={(params) => {
        return params.indexRelativeToCurrentPage % 2 !== 0 ? "odd-row" : "";
      }}
      pageSizeOptions={[5, 10, 20]}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={(model) => {
        onPageChange(model);
      }}
      disableRowSelectionOnClick
      sx={tableStyle}
    />
  );
}

export default ReportTable;
