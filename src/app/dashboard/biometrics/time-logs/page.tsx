"use client";
import React, { useState } from "react";
import PageInfo from "@/components/PageInfo";
import TimeLogsTable from "@/components/tables/TimeLogsTable";
import TimeLogsFilter from "@/components/TimeLogsFilter";
import { getPaginatedBiometricDevices } from "@/actions/biometricDevice";
import { reloadTimeLogs } from "@/actions/timeLogsPage";

const TimeLogs = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [triggerSync, setTriggerSync] = useState(false);
  const [timeLogs, setTimeLogs] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState({
    device: "",
    dateFrom: "",
    dateTo: "",
    page: "0",
    limit: "10",
  });

  // Load devices on mount and set first device
  React.useEffect(() => {
    const fetchDevices = async () => {
      try {
        const result = await getPaginatedBiometricDevices("", 0, 100);
        if (result.items && result.items.length > 0) {
          setDevices(result.items);

          // Auto-select first device if none is selected
          const params = new URLSearchParams(window.location.search);
          const currentDevice = params.get("device");

          if (!currentDevice) {
            const firstDevice = result.items[0];
            const defaultParams = {
              device: firstDevice.apiUri || "",
              dateFrom: params.get("dateFrom") || "",
              dateTo: params.get("dateTo") || "",
              page: params.get("page") || "0",
              limit: params.get("limit") || "10",
            };

            // Update URL with first device
            const queryString = Object.entries(defaultParams)
              .filter(([_, value]) => value)
              .map(([key, value]) => `${key}=${value}`)
              .join("&");

            window.history.replaceState(
              {},
              "",
              `${window.location.pathname}${queryString ? "?" + queryString : ""}`,
            );

            setSearchParams(defaultParams);
          }
        }
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      }
    };

    fetchDevices();
  }, []);

  // Load URL parameters on mount and when URL changes
  React.useEffect(() => {
    const updateParams = () => {
      const params = new URLSearchParams(window.location.search);
      const newParams = {
        device: params.get("device") || "",
        dateFrom: params.get("dateFrom") || "",
        dateTo: params.get("dateTo") || "",
        page: params.get("page") || "0",
        limit: params.get("limit") || "10",
      };

      console.log("Updating searchParams from URL:", newParams);
      setSearchParams(newParams);
    };

    updateParams();

    // Listen for URL changes
    const handlePopState = updateParams;
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleParamsChange = (params: any) => {
    console.log("Params changed in filter:", params);
    const newParams = {
      device: params.device || "",
      dateFrom: params.dateFrom || "",
      dateTo: params.dateTo || "",
      page: params.page || "0",
      limit: params.limit || "10",
    };

    console.log("Updating searchParams from filter:", newParams);
    setSearchParams(newParams);
  };

  const handleUploadComplete = () => {
    console.log("Upload completed, reloading data");
    reloadTimeLogs();
  };

  const handleTimeLogsUpdate = (logs: any[]) => {
    console.log("Time logs updated:", logs.length);
    setTimeLogs(logs);
  };

  const handleSync = () => {
    console.log("handleSync called in page component");
    // Trigger sync in the table
    setTriggerSync(true);

    // Reset trigger after a short delay
    setTimeout(() => {
      console.log("Resetting triggerSync to false");
      setTriggerSync(false);
    }, 100);
  };

  return (
    <div className="container">
      <header className="absolute top-4 -ml-4">
        <PageInfo
          title="Time Logs"
          info="View and manage biometric device time logs. Filter by device and date range to see attendance records."
        />
      </header>

      <main className="space-y-4">
        <TimeLogsFilter
          devices={devices}
          onSync={handleSync}
          onParamsChange={handleParamsChange}
          timeLogs={timeLogs}
          onUploadComplete={handleUploadComplete}
        />
        <section>
          <TimeLogsTable
            deviceUri={searchParams.device}
            dateFrom={searchParams.dateFrom}
            dateTo={searchParams.dateTo}
            page={Number(searchParams.page)}
            limit={Number(searchParams.limit)}
            reload={reloadTimeLogs}
            triggerSync={triggerSync}
            onTimeLogsUpdate={handleTimeLogsUpdate}
          />
        </section>
      </main>
    </div>
  );
};

export default TimeLogs;
