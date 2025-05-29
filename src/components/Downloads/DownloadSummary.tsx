"use client";
import { downloadSummary } from "@/actions/payroll";
import { format, set } from "date-fns";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";

function DownloadSummary() {
  const searchParams = useSearchParams();
  const [from, setFrom] = useState<Date>(new Date());
  const [to, setTo] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    const category = searchParams.get("category") || "all";

    setIsLoading(true);
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

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
      a.download = `Payroll_${category}_${format(from, "yyyy-MM-dd")}-${format(
        to,
        "yyyy-MM-dd"
      )}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
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
  );
}

export default DownloadSummary;
