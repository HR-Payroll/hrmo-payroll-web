"use client";
import { downloadSummary } from "@/actions/payroll";
import { formatTime } from "@/utils/dateFormatter";
import { Backdrop, CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";

function DownloadSummary() {
  const searchParams = useSearchParams();
  const [from, setFrom] = useState<Date>(new Date());
  const [to, setTo] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [closeDialog, setCloseDialog] = useState<boolean>(true);

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (from || to) {
      setFrom(new Date(from!));
      setTo(new Date(to!));
    }
  }, [searchParams]);

  const handleDownload = async () => {
    const category = searchParams.get("category") || "all";

    setIsLoading(true);
    setCloseDialog(false);
    try {
      if (category === "all") {
        await Promise.all([
          createCSVFile({
            category: "REGULAR",
            from,
            to,
          }),
          createCSVFile({
            category: "CASUAL",
            from,
            to,
          }),
          createCSVFile({
            category: "JOB_ORDER",
            from,
            to,
          }),
        ]);
      } else {
        await createCSVFile({
          category,
          from,
          to,
        });
      }

      setCloseDialog(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setCloseDialog(true);
    }
  };

  const createCSVFile = async ({
    category,
    from,
    to,
  }: {
    category: string;
    from: Date;
    to: Date;
  }) => {
    const response = await downloadSummary(from, to, category);

    if (response) {
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Payroll_${category}_${formatTime(
        from,
        "yyyy-MM-dd",
      )}-${formatTime(to, "yyyy-MM-dd")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      <button
        disabled={isLoading}
        onClick={() => {
          handleDownload();
        }}
        className="flex flex-row items-center justify-center rounded-md disabled:bg-[var(--border)]/60 bg-[var(--border)] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[var(--text)] text-sm cursor-pointer gap-x-2 py-2 px-5"
      >
        <MdOutlineFileDownload size={18} />
        <span className="hidden md:block">
          {isLoading ? "Downloading..." : "Download File"}
        </span>
      </button>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!closeDialog}
        onClick={() => setCloseDialog(true)}
      >
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-md gap-2">
          <CircularProgress size={42} />
          <span className="ml-2 text-[var(--text)] text-sm font-medium">
            Downloading summary, please wait...
          </span>
        </div>
      </Backdrop>
    </>
  );
}

export default DownloadSummary;
