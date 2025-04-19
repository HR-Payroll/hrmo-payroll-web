"use client";
import { downloadSummary } from "@/actions/payroll";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";

function DownloadSummary() {
  const searchParams = useSearchParams();
  const [from, setFrom] = useState<Date>(new Date());
  const [to, setTo] = useState<Date>(new Date());

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (from || to) {
      setFrom(new Date(from!));
      setTo(new Date(to!));
    }

    console.log(from, to);
  }, [searchParams]);

  const handleDownload = async () => {
    const response = await downloadSummary(from, to, "REGULAR");
    if (response) {
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "exported_data.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div
      onClick={() => {
        handleDownload();
      }}
      className="flex flex-row items-center justify-center rounded-md bg-[var(--border)] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[var(--text)] text-sm cursor-pointer gap-x-2 py-2 px-5"
    >
      <MdOutlineFileDownload size={18} />
      <span className="hidden md:block">Download File</span>
    </div>
  );
}

export default DownloadSummary;
