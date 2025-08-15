"use client";
import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatTime } from "@/utils/dateFormatter";
import DownloadSingleReport from "./DownloadSingleReport";

const DownloadSingleSummary = ({
  summary,
  employee,
}: //   numDays,
{
  summary: any;
  employee: any;
  numDays?: number;
}) => {
  const handleGeneratePDF = async () => {
    const tableRows = summary.map((summary: any) => {
      const { date, name, r1, r2, r3, r4, remarks } = summary;
      return [
        date,
        name["ref"] ? name["name"] : `${name["name"]} (no ref)`,
        r1 ? formatTime(r1, "hh:mm aa") : "",
        r2 ? formatTime(r2, "hh:mm aa") : "",
        r3 ? formatTime(r3, "hh:mm aa") : "",
        r4 ? formatTime(r4, "hh:mm aa") : "",
        remarks || "",
      ];
    });

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const imgData = await addImageProcess("/header_logo.png");
    const imgWidth = 180;
    const imgHeight = 35;
    const imgX = (doc.internal.pageSize.getWidth() - imgWidth) / 2; // Center the image
    const imgY = 10;
    doc.addImage(imgData, "PNG", imgX, imgY, imgWidth, imgHeight);

    const title = "Daily Time Report";
    const textWidth = doc.getTextWidth(title);
    const xPosition = (pageWidth - textWidth) / 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, xPosition, 56);

    doc.setFontSize(11);
    doc.text(`Employee: ${employee ? employee.name : "N/A"}`, 15, 64);
    doc.text(`Number of Days: ${employee ? employee.name : "N/A"}`, 15, 64);
    // doc.text(`Number of Days: ${numDays || "N/A"}`, 15, 70);

    const tableColumn = [
      "Date",
      "Employee Name",
      "Time In",
      "Time Out",
      "Time In",
      "Time Out",
      "Remarks",
    ];

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 76, // Position below the title
      styles: { fontSize: 11 },
      headStyles: { fillColor: [191, 219, 254], textColor: [0, 0, 0] }, // Custom header color
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
    <div
      onClick={() => handleGeneratePDF()}
      className="flex flex-row items-center justify-center rounded-md bg-[var(--border)] hover:bg-slate-300 active:bg-slate-400 active:text-white text-[var(--text)] text-sm cursor-pointer gap-x-2 py-2 px-5"
    >
      <MdOutlineFileDownload size={18} />
      <span className="hidden md:block">Download File</span>
    </div>
  );
};

export default DownloadSingleSummary;
