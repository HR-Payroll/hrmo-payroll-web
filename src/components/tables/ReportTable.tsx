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
  const [pageSize, setPageSize] = useState(limit);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setData(reports);
    setLoading(false);
  }, [reports]);

  const onPageChange = (model: GridPaginationModel) => {
    let query = pathname;

    if (model.page !== 0 && model.pageSize !== 10) {
      query = `${pathname}?page=${model.page}&limit=${model.pageSize}`;
    } else if (model.page !== 0) {
      query = `${pathname}?page=${model.page}`;
    } else if (model.pageSize !== 10) {
      query = `${pathname}?limit=${model.pageSize}`;
    }

    setLoading(true);
    router.push(query);
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
      paginationModel={{ page, pageSize }}
      onPaginationModelChange={(model) => {
        page = model.page;
        setPageSize(model.pageSize);
        onPageChange(model);
      }}
      disableRowSelectionOnClick
      sx={tableStyle}
    />
  );
}

export default ReportTable;
