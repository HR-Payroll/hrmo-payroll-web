"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { tableStyle } from "@/lib/themes";
import Alert from "@/components/ui/Alert";
import SnackbarInfo, { initialSnackbar } from "@/components/ui/SnackbarInfo";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface TimeLogRecord {
  punch: number;
  status: number;
  timestamp: string;
  user_id: string;
}

interface TimeLogsResponse {
  count: number;
  records: TimeLogRecord[];
}

interface TimeLogsTableProps {
  deviceUri: string;
  dateFrom: string;
  dateTo: string;
  page?: number;
  limit?: number;
  reload?: VoidFunction;
  triggerSync?: boolean;
  onTimeLogsUpdate?: (logs: TimeLogRecord[]) => void;
}

const TimeLogsTable: React.FC<TimeLogsTableProps> = ({
  deviceUri,
  dateFrom,
  dateTo,
  page = 0,
  limit = 10,
  reload,
  triggerSync = false,
  onTimeLogsUpdate,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [timeLogs, setTimeLogs] = useState<TimeLogRecord[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<TimeLogRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [pageSize, setPageSize] = useState(limit);
  const [totalCount, setTotalCount] = useState(0);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    modal: false,
  });

  // Use a ref to store the callback to prevent infinite loops
  const onTimeLogsUpdateRef = useRef(onTimeLogsUpdate);
  onTimeLogsUpdateRef.current = onTimeLogsUpdate;

  // Generate localStorage key based on device and dates
  const getStorageKey = useCallback(() => {
    return `timeLogs_${deviceUri}_${dateFrom}_${dateTo}`;
  }, [deviceUri, dateFrom, dateTo]);

  // Load cached data on mount (but don't fetch from API)
  useEffect(() => {
    const storageKey = getStorageKey();
    const cachedData = localStorage.getItem(storageKey);

    if (cachedData) {
      console.log("Loading cached data on mount:", storageKey);
      const parsedData: TimeLogsResponse = JSON.parse(cachedData);
      setTimeLogs(parsedData.records);
      setFilteredLogs(parsedData.records);
      setTotalCount(parsedData.count);

      // Notify parent of time logs update using ref
      if (onTimeLogsUpdateRef.current) {
        onTimeLogsUpdateRef.current(parsedData.records);
      }
    } else {
      console.log("No cached data found for:", storageKey);
    }
  }, [deviceUri, dateFrom, dateTo, getStorageKey]);

  // Fetch time logs only when sync is triggered
  useEffect(() => {
    console.log("TimeLogsTable triggerSync effect:", {
      triggerSync,
      deviceUri,
      dateFrom,
      dateTo,
    });
    if (triggerSync && deviceUri && dateFrom && dateTo) {
      console.log("Triggering fetchTimeLogs");
      fetchTimeLogs();
    }
  }, [triggerSync, deviceUri, dateFrom, dateTo]);

  // Fetch time logs from device API via server-side proxy
  const fetchTimeLogs = async () => {
    console.log("fetchTimeLogs called with:", { deviceUri, dateFrom, dateTo });

    if (!deviceUri || !dateFrom || !dateTo) {
      console.log("Missing required parameters, returning");
      return;
    }

    setIsLoading(true);

    try {
      // Check localStorage first
      const storageKey = getStorageKey();
      const cachedData = localStorage.getItem(storageKey);

      if (cachedData) {
        console.log("Found cached data, using it");
        const parsedData: TimeLogsResponse = JSON.parse(cachedData);
        setTimeLogs(parsedData.records);
        setFilteredLogs(parsedData.records);
        setTotalCount(parsedData.count);

        // Notify parent of time logs update using ref
        if (onTimeLogsUpdateRef.current) {
          onTimeLogsUpdateRef.current(parsedData.records);
        }

        setIsLoading(false);
        return;
      }

      console.log("No cached data, fetching from API");
      // Call our server-side API route to avoid CORS issues
      const response = await fetch("/api/time-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceUri,
          dateFrom,
          dateTo,
        }),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API response result:", result);

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch time logs");
      }

      const data: TimeLogsResponse = result.data;
      console.log("Parsed data:", data);

      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(data));

      setTimeLogs(data.records);
      setFilteredLogs(data.records);
      setTotalCount(data.count);

      // Notify parent of time logs update using ref
      if (onTimeLogsUpdateRef.current) {
        onTimeLogsUpdateRef.current(data.records);
      }

      setSnackbar({
        message: `Successfully synced ${data.count} time logs from device`,
        type: "success",
        modal: true,
      });
    } catch (error) {
      console.error("Failed to fetch time logs:", error);

      setSnackbar({
        message: "Failed to sync time logs from device",
        type: "error",
        modal: true,
      });

      // Try to load from localStorage as fallback
      const storageKey = getStorageKey();
      const cachedData = localStorage.getItem(storageKey);
      if (cachedData) {
        const parsedData: TimeLogsResponse = JSON.parse(cachedData);
        setTimeLogs(parsedData.records);
        setFilteredLogs(parsedData.records);
        setTotalCount(parsedData.count);
      }
    } finally {
      setIsLoading(false);
    }
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

  // Handle pagination
  const onPageChange = (model: GridPaginationModel) => {
    setCurrentPage(model.page);
    setPageSize(model.pageSize);
    onChangeFilter([
      { key: "page", value: model.page.toString() },
      { key: "limit", value: model.pageSize.toString() },
    ]);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Get status label
  const getStatusLabel = (status: number) => {
    const statusMap: { [key: number]: string } = {
      1: "Check-In",
      0: "Check-Out",
      15: "Late",
      // Add more status mappings as needed
    };
    return statusMap[status] || `Status ${status}`;
  };

  // Get punch label
  const getPunchLabel = (punch: number) => {
    const punchMap: { [key: number]: string } = {
      1: "Fingerprint",
      0: "Face",
      2: "Card",
      // Add more punch type mappings as needed
    };
    return punchMap[punch] || `Type ${punch}`;
  };

  // Table columns
  const columns: GridColDef[] = [
    {
      field: "user_id",
      headerName: "User ID",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      headerClassName: "custom-header",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => formatTimestamp(params.value),
    },
    {
      field: "punch",
      headerName: "Punch Type",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "custom-header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value,
    },
  ];

  // Get paginated data
  const paginatedData = filteredLogs.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize,
  );

  return (
    <>
      <DataGrid
        rows={paginatedData}
        columns={columns}
        loading={isLoading}
        getRowId={(row: any) => `${row.user_id}-${row.timestamp}`}
        columnHeaderHeight={40}
        rowHeight={36}
        rowCount={totalCount}
        getRowClassName={(params) => {
          return params.indexRelativeToCurrentPage % 2 !== 0 ? "odd-row" : "";
        }}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        paginationMode="server"
        paginationModel={{ page: currentPage, pageSize }}
        onPaginationModelChange={(model) => {
          setCurrentPage(model.page);
          setPageSize(model.pageSize);
          onPageChange(model);
        }}
        disableRowSelectionOnClick
        sx={tableStyle}
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
};

export default TimeLogsTable;
