"use client";
import React, { useState } from "react";
import { MdOutlineUploadFile } from "react-icons/md";
import * as XLSX from "xlsx";
import SnackbarInfo, { initialSnackbar } from "./ui/SnackbarInfo";
import { uploadDepartment } from "@/actions/department";

const UploadButton = ({ reload }: { reload?: VoidFunction }) => {
  const [isUploading, setUploading] = useState(false);
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
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsedData: any = XLSX.utils.sheet_to_json(sheet);
      onUploadFile(parsedData.slice(1));
    };

    reader.readAsArrayBuffer(file);
  };

  const onUploadFile = async (data: any) => {
    setUploading(true);

    try {
      const result = (await uploadDepartment(data)) as any;

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
    <div
      className={`${
        isUploading ? "opacity-60" : "opacity-100"
      } flex flex-row items-center justify-center rounded-md bg-[var(--border)] hover:bg-slate-300 active:bg-slate-400 active:text-white py-2 px-7`}
    >
      <label
        className="flex items-center text-xs text-[var(--text)] active:text-white gap-2 cursor-pointer"
        htmlFor="upload"
      >
        <MdOutlineUploadFile size={18} />
        <span className="hidden md:block text-sm">
          {isUploading ? "Uploading..." : "Upload File"}
        </span>
      </label>
      <input
        type="file"
        id="upload"
        className="hidden"
        accept=".csv, .xlsx"
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
  );
};

export default UploadButton;
