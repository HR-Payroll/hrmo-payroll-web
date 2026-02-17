"use client";
import React, { useEffect, useState } from "react";
import Alert from "../ui/Alert";
import { tableStyle } from "@/lib/themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SnackbarInfo, { initialSnackbar } from "../ui/SnackbarInfo";
import {
  updateBiometricDevice,
  deleteBiometricDevice,
} from "@/actions/biometricDevice";
import { MdDeleteOutline, MdCheck, MdClose, MdEdit } from "react-icons/md";
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridEditInputCell,
  GridPaginationModel,
  GridPreProcessEditCellProps,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import dynamic from "next/dynamic";

const BiometricDeviceForm = dynamic(
  () => import("../forms/BiometricDeviceForm"),
  {
    loading: () => <h1 className="text-xs text-[var(--text)]">Loading...</h1>,
  },
);

function BiometricDeviceTable({
  devices,
  reload,
  isLoading,
  page = 0,
  limit = 10,
  rowCount = 0,
}: {
  devices?: any[];
  reload?: VoidFunction;
  isLoading?: boolean;
  page?: number;
  limit?: number;
  rowCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [data, setData] = useState(devices);
  const [isDelete, setDelete] = useState(null);
  const [isEditing, setEditing] = useState<any>();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [pageSize, setPageSize] = useState(limit);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    modal: false,
  });

  useEffect(() => {
    setData(devices);
  }, [devices]);

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

  const onPageChange = (model: GridPaginationModel) => {
    onChangeFilter([
      { key: "page", value: model.page.toString() },
      { key: "limit", value: model.pageSize.toString() },
    ]);
  };

  const columns: GridColDef[] = [
    {
      field: "deviceId",
      headerName: "Device ID",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const value = params.props.value;
        const hasError =
          value.length < 1 || value === ""
            ? "Please input a valid device ID."
            : null;
        return { ...params.props, error: hasError };
      },
      renderEditCell: (props: GridRenderEditCellParams) => {
        const { error } = props;

        return (
          <StyledTooltip open={!!error} title={error}>
            <GridEditInputCell {...props} />
          </StyledTooltip>
        );
      },
    },
    {
      field: "name",
      headerName: "Device Name",
      headerClassName: "custom-header",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const value = params.props.value;
        const hasError =
          value.length < 1 || value === ""
            ? "Please input a valid device name."
            : null;
        return { ...params.props, error: hasError };
      },
      renderEditCell: (props: GridRenderEditCellParams) => {
        const { error } = props;

        return (
          <StyledTooltip open={!!error} title={error}>
            <GridEditInputCell {...props} />
          </StyledTooltip>
        );
      },
    },
    {
      field: "location",
      headerName: "Location",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
      preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
        const value = params.props.value;
        const hasError =
          value.length < 1 || value === ""
            ? "Please input a valid location."
            : null;
        return { ...params.props, error: hasError };
      },
      renderEditCell: (props: GridRenderEditCellParams) => {
        const { error } = props;

        return (
          <StyledTooltip open={!!error} title={error}>
            <GridEditInputCell {...props} />
          </StyledTooltip>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: ["Online", "Offline", "Maintenance"],
      editable: true,
      valueSetter: (value, row) => {
        const status = {
          Online: "ONLINE",
          Offline: "OFFLINE",
          Maintenance: "MAINTENANCE",
        } as any;

        return { ...row, status: status[value] };
      },
      valueGetter: (row) => {
        const status = {
          ONLINE: "Online",
          OFFLINE: "Offline",
          MAINTENANCE: "Maintenance",
        };

        return status[row] || "Offline";
      },
      renderCell: (params) => {
        const status = params.value;
        const isOnline = status === "Online";
        const isOffline = status === "Offline";
        const isMaintenance = status === "Maintenance";

        return (
          <div className="flex h-full items-center justify-center">
            <span
              className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                isOnline
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : isOffline
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-yellow-100 text-yellow-800 border border-yellow-200"
              }`}
            >
              {status}
            </span>
          </div>
        );
      },
    },
    {
      field: "lastSync",
      headerName: "Last Sync",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
      renderCell: (params) => {
        if (!params.value) return "Never";
        return new Date(params.value).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
      field: "action",
      headerName: "Actions",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const row = data?.find((row: any) => row.id === Number(params.id));

        return (
          <div className="flex gap-1 justify-center">
            {/* Edit Button */}
            <div
              onClick={() => {
                if (row) {
                  setSelectedDevice(row);
                  setEditModalOpen(true);
                }
              }}
              className="flex items-center justify-center p-1 cursor-pointer"
              title="Edit Device"
            >
              <MdEdit
                size={24}
                className="w-fit rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 p-1"
              />
            </div>

            {/* Delete Button */}
            <div
              onClick={() => {
                setDelete(params.id);
              }}
              className="flex items-center justify-center p-1 cursor-pointer"
              title="Delete Device"
            >
              <MdDeleteOutline
                size={24}
                className="w-fit rounded-full bg-red-100 hover:bg-red-200 text-red-600 p-1"
              />
            </div>
          </div>
        );
      },
    },
  ];

  const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  }));

  const onUpdate = async (
    id: number,
    payload: {
      deviceId?: string;
      name?: string;
      location?: string;
      status?: string;
    },
  ) => {
    try {
      await updateBiometricDevice(id, payload);
      setSnackbar({
        message: "Device info successfully updated!",
        type: "success",
        modal: true,
      });

      const temp = { ...isEditing };
      delete temp[id];
      setEditing(temp);
    } catch (error) {
      setSnackbar({
        message: "Failed to update device!",
        type: "error",
        modal: true,
      });
    }
  };

  const onDelete = async () => {
    try {
      await deleteBiometricDevice(Number(isDelete!));
      if (reload) reload();
    } catch (error) {
      setSnackbar({
        message: "Failed to delete device!",
        type: "error",
        modal: true,
      });
    }
  };

  const processUpdate = async (newRow: any, oldRow: any, params: any) => {
    const isChanged = Object.keys(newRow).some((key) => {
      const newValue = newRow[key];
      const oldValue = oldRow[key];

      if (typeof newValue === "object" && typeof oldValue === "object") {
        return JSON.stringify(newValue) !== JSON.stringify(oldValue);
      }

      return newValue !== oldValue;
    });

    if (
      (isChanged && !isEditing) ||
      (isEditing && !Object.keys(isEditing).includes(params.rowId))
    ) {
      setEditing({ ...isEditing, [params.rowId]: oldRow });
    }

    setData((prev: any) =>
      prev.map((row: any) => (row.id === Number(params.rowId) ? newRow : row)),
    );

    return { ...newRow, isNew: false };
  };

  return (
    <>
      <Alert
        open={!!isDelete}
        title="Delete Device"
        message="Are you sure you want to delete this biometric device?"
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

      {/* Edit Modal */}
      {editModalOpen && selectedDevice && (
        <div className="h-full w-full fixed top-0 left-0 bg-radial from-blue-500/50 from-5% to-transparent to-80% z-50 flex items-center justify-center overflow-auto">
          <div className="relative w-[70%] sm:w-[60%] md:w-[50%] lg:w-[60%] xl:w-[40%] bg-white rounded-md border-2 border-[var(--border)] p-4">
            <BiometricDeviceForm
              data={selectedDevice}
              editMode={true}
              onClose={() => {
                setEditModalOpen(false);
                setSelectedDevice(null);
                if (reload) reload();
              }}
              setSnackbar={setSnackbar}
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedDevice(null);
                }}
                className="rounded-full hover:bg-blue-100 active:bg-blue-200 active:text-[var(--accent)] text-[var(--text)] text-base p-2 cursor-pointer"
              >
                <MdClose />
              </button>
            </div>
          </div>
        </div>
      )}

      <DataGrid
        rows={data || []}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row.id.toString()}
        columnHeaderHeight={40}
        rowHeight={36}
        rowCount={rowCount}
        getRowClassName={(params) => {
          if (isEditing && Object.keys(isEditing).includes(params.id as string))
            return "edited-row";

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
        processRowUpdate={processUpdate}
      />
      {snackbar.modal && (
        <SnackbarInfo
          isOpen={snackbar.modal}
          type={snackbar.type as any}
          message={snackbar.message}
          onClose={() => {
            setSnackbar(initialSnackbar);
          }}
        />
      )}
    </>
  );
}

export default BiometricDeviceTable;
