"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import TimeLogsUpload from "@/components/TimeLogsUpload";

const TimeLogsFilter = ({
  devices,
  onSync,
  onParamsChange,
  timeLogs,
  onUploadComplete,
}: {
  devices: {
    id: string;
    deviceId: string;
    name: string;
    apiUri: string;
    location: string;
    status: string;
    lastSync: Date;
    createdAt: Date;
    updatedAt: Date;
  }[];
  onSync?: () => void;
  onParamsChange?: (params: any) => void;
  timeLogs?: any[];
  onUploadComplete?: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [deviceFilter, setDeviceFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

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

    // Notify parent of parameter changes
    if (onParamsChange) {
      onParamsChange(params);
    }

    router.push(`${pathname}${path}`);
  };

  const handleSync = () => {
    console.log("Sync button clicked");
    console.log("Current filters:", { deviceFilter, dateFrom, dateTo });

    // Reset page to 0 when syncing
    onChangeFilter([{ key: "page", value: "0" }]);

    // Trigger sync callback
    if (onSync) {
      console.log("Calling onSync callback");
      onSync();
    } else {
      console.log("No onSync callback provided");
    }
  };

  useEffect(() => {
    const device = searchParams.get("device") || "";
    const from = searchParams.get("dateFrom") || "";
    const to = searchParams.get("dateTo") || "";

    setDeviceFilter(device);
    setDateFrom(from);
    setDateTo(to);
  }, [searchParams]);

  return (
    <div className="flex flex-col sm:flex-row items-start justify-start gap-4 text-[var(--text)] text-sm">
      {/* Device Selection */}
      <div className="relative flex flex-row items-center justify-center gap-2">
        <select
          className="appearance-none outline-none rounded-md ring-2 ring-[var(--border)] py-1.5 px-8 cursor-pointer"
          value={deviceFilter}
          onChange={(e) => {
            setDeviceFilter(e.target.value);
            onChangeFilter([
              { key: "device", value: e.target.value },
              { key: "page", value: "0" },
            ]);
          }}
        >
          <option value="">Select Device</option>
          {devices &&
            devices.length > 0 &&
            devices.map((device) => (
              <option key={device.id} value={device.apiUri}>
                {device.name} ({device.deviceId})
              </option>
            ))}
        </select>
        <MdOutlineKeyboardArrowDown
          className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 pointer-events-none cursor-pointer"
          size={18}
        />
      </div>

      {/* Date From */}
      <div className="flex flex-row items-center justify-between gap-x-4">
        <span className="text-sm font-medium">From:</span>
        <input
          value={dateFrom}
          type="date"
          className="outline-none rounded-md border-2 border-[var(--border)] text-sm py-1.5 px-4 cursor-pointer"
          onChange={(e) => {
            setDateFrom(e.target.value);
            onChangeFilter([
              { key: "dateFrom", value: e.target.value },
              { key: "page", value: "0" },
            ]);
          }}
        />
      </div>

      {/* Date To */}
      <div className="flex flex-row items-center justify-between gap-x-4">
        <span className="text-sm font-medium">To:</span>
        <input
          value={dateTo}
          type="date"
          className="outline-none rounded-md border-2 border-[var(--border)] text-sm py-1.5 px-4 cursor-pointer"
          min={dateFrom}
          onChange={(e) => {
            setDateTo(e.target.value);
            onChangeFilter([
              { key: "dateTo", value: e.target.value },
              { key: "page", value: "0" },
            ]);
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row items-center gap-2">
        {/* Sync Button */}
        <button
          onClick={handleSync}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer"
        >
          Sync Records
        </button>

        {/* Upload Button */}
        <TimeLogsUpload
          timeLogs={timeLogs || []}
          onUploadComplete={onUploadComplete}
        />
      </div>
    </div>
  );
};

export default TimeLogsFilter;
