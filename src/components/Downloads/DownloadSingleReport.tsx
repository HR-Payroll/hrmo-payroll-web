"use client";
import React, { useEffect } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatTime } from "@/utils/dateFormatter";
import { format } from "date-fns";

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
    const tableRows = reports.map((report) => {
      const { date, name, r1, r2, r3, r4, remarks } = report;
      return [
        date,
        name,
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

    const title = "Daily Time Record (DTR)";
    const textWidth = doc.getTextWidth(title);
    const xPosition = (pageWidth - textWidth) / 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(title, xPosition, 56);
    doc.setFont("helvetica", "normal");

    const date = `${format(filter.from, "MM/dd/yy")} to ${format(
      filter.to,
      "MM/dd/yy"
    )}`;

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

    toHighLightText(doc, "Date: ", date, 15, 80);

    const depText = `Department: ${employee?.department?.name || "N/A"}`;
    const catText = `Category: ${employee?.category || "N/A"}`;
    const depWidth = doc.getTextWidth(depText);
    const catWidth = doc.getTextWidth(catText);
    const rightMargin = 15;
    const xPosition_h = pageWidth - Math.max(depWidth, catWidth) - rightMargin;

    toHighLightText(
      doc,
      "Category: ",
      employee ? employee.category : "N/A",
      xPosition_h,
      68
    );

    toHighLightText(
      doc,
      "Department: ",
      employee?.department?.name || "N/A",
      xPosition_h,
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

    let tableHeight = 88;
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

    const certText =
      "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 I HEREBY CERTIFY on my honor that the above is true and correct record of the hours of work performed, record of which was made daily at the time of arrival and departure from the office.";

    const wrappedText = doc.splitTextToSize(certText, pageWidth - 30);
    doc.text(wrappedText, 15, tableHeight + 32);

    const signatureY = tableHeight + 45;
    const sigLineWidth = 60;

    // Center X position for both lines
    const centerX = 15;

    doc.line(centerX, signatureY, centerX + sigLineWidth, signatureY);
    doc.setFontSize(10);
    const empSigLabel = "Employee's Signature";
    const empSigLabelWidth = doc.getTextWidth(empSigLabel);
    doc.text(
      empSigLabel,
      centerX + sigLineWidth / 2 - empSigLabelWidth / 2,
      signatureY + 6
    );

    doc.text(
      "Verified as to the prescribed office hour.",
      centerX,
      signatureY + 18
    );

    const headY = signatureY + 28;
    doc.line(centerX, headY, centerX + sigLineWidth, headY);
    const headLabel = "Head of Office";
    const headLabelWidth = doc.getTextWidth(headLabel);
    doc.text(
      headLabel,
      centerX + sigLineWidth / 2 - headLabelWidth / 2,
      headY + 6
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
