"use client";
import React, { useEffect } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatTime } from "@/utils/dateFormatter";

const DownloadSingleReport = ({
  reports,
  employee,
  numDays,
  totalLate,
}: {
  reports: any[];
  employee: any;
  numDays?: number;
  totalLate?: number;
}) => {
  const handleGeneratePDF = async () => {
    const tableRows = reports.map((report) => {
      const { date, name, r1, r2, r3, r4, remarks } = report;
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

    const title = "Daily Time Report (DTR)";
    const textWidth = doc.getTextWidth(title);
    const xPosition = (pageWidth - textWidth) / 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(title, xPosition, 56);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    toHighLightText(
      doc,
      "Employee: ",
      employee ? employee.name : "N/A",
      15,
      68
    );

    toHighLightText(
      doc,
      "Record No: ",
      employee ? employee.recordNo : "N/A",
      15,
      74
    );

    const depWidth = doc.getTextWidth(
      ` Department: ${employee.department.name || "N/A"}`
    );
    const catWidth = doc.getTextWidth(
      ` Category: ${employee.category || "N/A"}`
    );

    toHighLightText(
      doc,
      "Category: ",
      employee ? employee.category : "N/A",
      pageWidth - (depWidth > catWidth ? depWidth - 16 : catWidth) - 16,
      68
    );

    toHighLightText(
      doc,
      "Department: ",
      employee.department.name || "N/A",
      pageWidth - (depWidth > catWidth ? depWidth - 16 : catWidth) - 16,
      74
    );

    const tableColumn = [
      "Date",
      "Employee Name",
      "Time In",
      "Time Out",
      "Time In",
      "Time Out",
      "Remarks",
    ];

    let tableHeight = 82;
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: tableHeight,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [191, 219, 254], textColor: [0, 0, 0] },
      didDrawPage: (data) => {
        tableHeight = data.cursor!.y;
      },
    });

    toHighLightText(
      doc,
      "Number of Days: ",
      `${numDays || "N/A"}`,
      15,
      tableHeight + 10
    );
    toHighLightText(
      doc,
      "Minutes of Late: ",
      `${totalLate || "N/A"}`,
      15,
      tableHeight + 16
    );

    //doc.save("User_Report.pdf");
    window.open(doc.output("bloburl"), "_blank");
  };

  function toHighLightText(
    doc: jsPDF,
    label: string,
    text: string,
    xPosition: number,
    yPosition: number
  ) {
    doc.text(label, xPosition, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text(text, doc.getTextWidth(label) + xPosition, yPosition);
    doc.setFont("helvetica", "normal");
  }

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
