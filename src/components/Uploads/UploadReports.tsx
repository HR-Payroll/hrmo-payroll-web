"use client";
import React, { useState } from "react";
import { MdOutlineUploadFile } from "react-icons/md";
import SnackbarInfo, { initialSnackbar } from "../ui/SnackbarInfo";
import { uploadReport } from "@/actions/report";
import { Backdrop, CircularProgress } from "@mui/material";

const UploadReports = ({ reload }: { reload?: VoidFunction }) => {
  const [isUploading, setUploading] = useState(false);
  const [isUpload, setUpload] = useState<any[]>([]);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "info",
    modal: false,
  });

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result;
      const lines = text
        .split("\n")
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .map((line: string) => {
          const data = line.split("\t");

          if (data.length === 5) {
            const [recordNo, name, timestamp] = line.split("\t");

            const date = new Date(timestamp);
            return {
              recordNo,
              name,
              timestamp: date,
              index: `${recordNo}-${date.toISOString()}`,
            };
          } else if (data.length === 6) {
            const [recordNo, timestamp] = line.split("\t");

            const date = new Date(timestamp);
            return {
              recordNo: recordNo.padEnd(9, "0"),
              name: "N/A",
              timestamp: date,
              index: `${recordNo.padEnd(9, "0")}-${date.toISOString()}`,
            };
          } else {
            return setSnackbar({
              message: "Invalid file format",
              type: "error",
              modal: true,
            });
          }
        });

      console.log(lines);
      setUpload(lines);
      //onUploadFile(lines);
      e.preventDefault();
    };

    reader.readAsText(file);
  };

  const onUploadFile = async (data: any) => {
    setUploading(true);

    try {
      const result = (await uploadReport(data)) as any;

      if (result && result.error) {
        setUploading(false);
        return setSnackbar({
          message: result.error,
          type: "error",
          modal: true,
        });
      }

      setSnackbar({
        message: result.success,
        type: "success",
        modal: true,
      });

      if (reload) reload();
      setUploading(false);
      setUpload([]);
    } catch (error: any) {
      setUploading(false);
      setSnackbar({
        message: error.message,
        type: "error",
        modal: true,
      });
    }
  };

  return (
    <>
      <div
        className={`${
          isUploading ? "opacity-60" : "opacity-100"
        } flex flex-row items-center justify-center rounded-md bg-[var(--border)] hover:bg-slate-300 active:bg-slate-400 active:text-white py-2 px-6`}
      >
        <label
          className="flex items-center text-xs text-[var(--text)] gap-2 cursor-pointer"
          htmlFor="upload"
        >
          <MdOutlineUploadFile size={18} />
          <span className="hidden lg:block text-sm">
            {isUploading ? "Uploading..." : "Upload Report"}
          </span>
        </label>
        <input
          type="file"
          id="upload"
          className="hidden"
          accept=".csv, .xlsx, .dat"
          disabled={isUploading}
          onChange={handleFileUpload}
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
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isUpload.length > 0}
        onClick={() => {
          if (!isUploading) setUpload([]);
        }}
      >
        <div className="w-full max-w-[300px] h-max-[200px] bg-white p-4 rounded-md text-[var(--text)] cursor-default ">
          {!isUploading ? (
            <div className="gap-4 flex flex-col">
              <h1 className=" font-semibold">Upload Reports</h1>

              <p className="text-sm mt-2">
                You are about to upload{" "}
                <span className="font-semibold">
                  {isUpload && isUpload.length}
                </span>{" "}
                entries. Proceed to upload?
              </p>
              <button
                onClick={() => {
                  onUploadFile(isUpload);
                }}
                className="w-full h-8 rounded-md bg-blue-200 hover:bg-blue-300 text-sm font-semibold mt-4 mb-4 cursor-pointer"
              >
                Upload
              </button>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-4 my-4 text-sm">
              <CircularProgress
                color="inherit"
                size={32}
                className="text-[var(--bluetext)]"
              />
              <p>Uploading, please wait...</p>
            </div>
          )}
        </div>
      </Backdrop>
    </>
  );
};

export default UploadReports;
