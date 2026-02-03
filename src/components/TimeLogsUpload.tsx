"use client";
import React, { useState } from "react";
import { uploadReport } from "@/actions/report";
import { Backdrop, CircularProgress } from "@mui/material";
import pLimit from "p-limit";

interface TimeLogRecord {
  punch: number;
  status: number;
  timestamp: string;
  user_id: string;
}

interface ReportData {
  recordNo: string;
  name: string;
  timestamp: Date;
  index: string;
  createdAt: Date;
}

const TimeLogsUpload = ({
  timeLogs,
  onUploadComplete,
}: {
  timeLogs: TimeLogRecord[];
  onUploadComplete?: () => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Convert time logs to report format
  const convertToReportData = (logs: TimeLogRecord[]): ReportData[] => {
    const createdAt = new Date();

    return logs.map((log) => {
      const timestamp = new Date(log.timestamp);

      return {
        recordNo: log.user_id.padStart(9, "0"),
        name: `Employee ${log.user_id}`, // Since we don't have user_name, use user_id
        timestamp: timestamp,
        index: `${log.user_id.padStart(9, "0")}-${timestamp.toISOString()}`,
        createdAt: createdAt,
      };
    });
  };

  const handleUpload = async () => {
    setIsUploading(true);

    try {
      const reportData = convertToReportData(timeLogs);

      // Use the same chunking logic as UploadReports
      const limit = pLimit(5);
      const CHUNK_SIZE = 20000;
      const promises: Promise<any>[] = [];

      for (let i = 0; i < reportData.length; i += CHUNK_SIZE) {
        const chunk = reportData.slice(i, i + CHUNK_SIZE);
        promises.push(limit(() => uploadReport(chunk)));
      }

      const results = await Promise.all(promises);
      const errorChunk = results.find((r) => r && r.error);

      if (errorChunk) {
        setIsUploading(false);
        setShowConfirmDialog(false);
        alert(`Upload failed: ${errorChunk.error}`);
        return;
      }

      alert(`Successfully uploaded ${reportData.length} time logs to reports!`);

      if (onUploadComplete) {
        onUploadComplete();
      }

      setIsUploading(false);
      setShowConfirmDialog(false);
    } catch (error: any) {
      setIsUploading(false);
      setShowConfirmDialog(false);
      alert(`Upload failed: ${error.message}`);
    }
  };

  const handleShowConfirm = () => {
    if (timeLogs.length === 0) {
      alert("No time logs to upload. Please sync data first.");
      return;
    }
    setShowConfirmDialog(true);
  };

  return (
    <>
      <button
        onClick={handleShowConfirm}
        disabled={timeLogs.length === 0}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          timeLogs.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        }`}
      >
        Upload to Reports ({timeLogs.length})
      </button>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showConfirmDialog}
      >
        <div className="w-full max-w-[300px] bg-white p-4 rounded-md text-[var(--text)] cursor-default">
          {!isUploading ? (
            <div className="gap-4 flex flex-col">
              <h1 className="font-semibold">Upload Time Logs to Reports</h1>

              <p className="text-sm mt-2">
                You are about to upload{" "}
                <span className="font-semibold">{timeLogs.length}</span> time
                log entries to the reports system. Proceed to upload?
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 h-8 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="flex-1 h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer"
                >
                  Upload
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center gap-4 my-4 text-sm">
              <CircularProgress
                color="inherit"
                size={32}
                className="text-blue-600"
              />
              <p>Uploading time logs, please wait...</p>
            </div>
          )}
        </div>
      </Backdrop>
    </>
  );
};

export default TimeLogsUpload;
