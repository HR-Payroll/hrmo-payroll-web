"use client";
import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

const DownloadSingleReport = ({
  reports,
  employee,
}: {
  reports: any[];
  employee: any;
}) => {
  const handleGeneratePDF = () => {
    const tableRows = reports.map((report) => {
      const { date, name, r1, r2, r3, r4 } = report;
      return [
        date,
        name["ref"] ? name["name"] : `${name["name"]} (no ref)`,
        r1 ? format(r1, "hh:mm aa") : "",
        r2 ? format(r2, "hh:mm aa") : "",
        r3 ? format(r3, "hh:mm aa") : "",
        r4 ? format(r4, "hh:mm aa") : "",
      ];
    });

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = `DTR Report (${employee})`;
    const textWidth = doc.getTextWidth(title);
    const xPosition = (pageWidth - textWidth) / 2;
    doc.text(title, xPosition, 20);

    const tableColumn = [
      "Date",
      "Employee Name",
      "Time In",
      "Time Out",
      "Time In",
      "Time Out",
    ];

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30, // Position below the title
      styles: { fontSize: 11 },
      headStyles: { fillColor: [191, 219, 254], textColor: [0, 0, 0] }, // Custom header color
    });

    //doc.save("User_Report.pdf");
    window.open(doc.output("bloburl"), "_blank");
  };

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

export default DownloadSingleReport;
