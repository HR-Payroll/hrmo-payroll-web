"use client";
import React, { useEffect, useState } from "react";
import { tableStyle } from "@/lib/themes";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Link from "next/link";
import { format } from "date-fns";
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

  useEffect(() => {
    setData(reports);
  }, [reports]);

  const onChangeFilter = (key: string, value: string) => {
    let path = "";
    const params = Object.fromEntries(searchParams.entries());

    if (params[key]) delete params[key];
    if (value) params[key] = value;

    Object.keys(params).forEach((key, index) => {
      if (index === 0) path += `?${key}=${params[key]}`;
      else path += `&${key}=${params[key]}`;
    });

    router.push(`${pathname}${path}`);
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
      valueGetter: (value) => {
        return value["ref"] ? value["name"] : `${value["name"]} (no ref)`;
      },
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
        const dept = departments.find(
          (item: any) => value.$oid === item._id.$oid
        );
        return dept ? dept.name : "N/A";
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
      rowCount={rowCount}
      getRowClassName={(params) => {
        return params.indexRelativeToCurrentPage % 2 !== 0 ? "odd-row" : "";
      }}
      pageSizeOptions={[5, 10, 20]}
      paginationMode="server"
      paginationModel={{ page, pageSize }}
      onPaginationModelChange={(model: any) => {
        page = model.page;
        setPageSize(model.pageSize);

        let key = Object.keys(model)[0] as string;
        onChangeFilter(key === "pageSize" ? "limit" : key, model[key]);
      }}
      disableRowSelectionOnClick
      sx={tableStyle}
    />
  );
}

export default ReportTable;
