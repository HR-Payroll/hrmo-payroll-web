"use client";
import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { jsPDF } from "jspdf";
import { generatePDFReport } from "@/utils/pdfReports";

interface Reports extends Employee {
  reports: any[];
  totalDays?: number;
  totalLate?: number;
}

const DownloadMultipleReports = ({
  reports,
  filter,
  disable,
}: {
  reports: Reports[];
  filter: { from: Date; to: Date };
  disable?: boolean;
}) => {
  const handleGeneratePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const imgData = await addImageProcess("/header_logo.png");
    const imgWidth = 180;
    const imgHeight = 35;
    const imgX = (doc.internal.pageSize.getWidth() - imgWidth) / 2; // Center the image
    const imgY = 10;

    reports.forEach((report, index) => {
      const userReports = report.reports;
      const employee = { ...report };
      const numDays = report.totalDays || 0;
      const totalLate = report.totalLate || 0;

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
          reports: userReports,
          employee,
          numDays,
          totalLate,
          filter,
        }
      );

      if (index < reports.length - 1) {
        doc.addPage();
      }
    });

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
      className="flex flex-row items-center justify-center rounded-md bg-[var(--border)] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[var(--text)] text-sm cursor-pointer gap-x-2 py-2 px-5 disabled:opacity-50"
      disabled={disable}
    >
      <MdOutlineFileDownload size={18} />
      <span className="hidden md:block">Export/Department</span>
    </button>
  );
};

export default DownloadMultipleReports;
