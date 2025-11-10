"use client";

import jsPDF from "jspdf";
import { formatTime } from "./dateFormatter";
import autoTable from "jspdf-autotable";

interface PDFReportParams {
  reports: any[];
  employee: Employee;
  numDays?: number;
  totalLate?: number;
  filter: { from: Date; to: Date };
}

interface PDFDocParams {
  doc: jsPDF;
  pageWidth: number;
  imgData: string;
  imgWidth: number;
  imgHeight: number;
  imgX: number;
  imgY: number;
}

export const generatePDFReport = async (
  docParams: PDFDocParams,
  params: PDFReportParams
) => {
  const { reports, employee, numDays, totalLate, filter } = params;
  const { doc, pageWidth, imgData, imgWidth, imgHeight, imgX, imgY } =
    docParams;

  const tableRows = reports.map((report) => {
    const { date, name, r1, r2, r3, r4, remarks } = report;
    return [
      date ? formatTime(date, "yyyy-MM-DD - ddd") : "",
      name,
      r1 ? formatTime(r1, "hh:mm A") : "",
      r2 ? formatTime(r2, "hh:mm A") : "",
      r3 ? formatTime(r3, "hh:mm A") : "",
      r4 ? formatTime(r4, "hh:mm A") : "",
      remarks || "",
    ];
  });

  doc.addImage(imgData, "PNG", imgX, imgY, imgWidth, imgHeight);

  const title = "Daily Time Record (DTR)";
  const textWidth = doc.getTextWidth(title);
  const xPosition = (pageWidth - textWidth) / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(title, xPosition, 56);
  doc.setFont("helvetica", "normal");

  const date = `${formatTime(filter.from, "MM/DD/yy")} to ${formatTime(
    filter.to,
    "MM/DD/yy"
  )}`;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  toHighLightText(doc, "Employee: ", employee ? employee.name : "N/A", 15, 68);

  toHighLightText(
    doc,
    "Record No: ",
    employee ? employee.recordNo : "N/A",
    15,
    74
  );

  toHighLightText(doc, "Schedule: ", employee.schedule.name, 15, 80);
  toHighLightText(doc, "Date: ", date, 15, 86);

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

  let tableHeight = 96;
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

  // === PAGE OVERFLOW HANDLER ===
  const pageHeight = doc.internal.pageSize.height;
  const remainingSpace = pageHeight - tableHeight - 20; // estimate needed for footer

  console.log("Remaining Space:", remainingSpace);
  console.log("Table Height:", tableHeight);
  console.log("Page Height:", pageHeight);

  if (remainingSpace < 30) {
    doc.addPage();
    tableHeight = 20; // new starting Y on next page
  }

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

  return doc;
};
