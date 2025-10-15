"use client";
import React, { useEffect } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatTime } from "@/utils/dateFormatter";
import { generatePDFReport } from "@/utils/pdfReports";

const DownloadSingleReport = ({
  reports,
  employee,
  numDays,
  totalLate,
  filter,
}: {
  reports: any[];
  employee: any;
  numDays?: number;
  totalLate?: number;
  filter: { from: Date; to: Date };
}) => {
  const handleGeneratePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const imgData = await addImageProcess("/header_logo.png");
    const imgWidth = 180;
    const imgHeight = 35;
    const imgX = (doc.internal.pageSize.getWidth() - imgWidth) / 2; // Center the image
    const imgY = 10;

    generatePDFReport(
      {
        doc,
        pageWidth,
        imgData: imgData.src,
        imgWidth,
        imgHeight,
        imgX,
        imgY,
      },
      {
        reports,
        employee,
        numDays,
        totalLate,
        filter,
      }
    );

    //doc.save("User_Report.pdf");
    window.open(doc.output("bloburl"), "_blank");
  };

  async function addImageProcess(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      let img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  return (
    <button
      onClick={() => handleGeneratePDF()}
      className="flex flex-row items-center justify-center rounded-md bg-[var(--border)] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[var(--text)] text-sm cursor-pointer gap-x-2 py-2 px-5"
    >
      <MdOutlineFileDownload size={18} />
      <span className="hidden md:block">Download File</span>
    </button>
  );
};

export default DownloadSingleReport;
