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

  toHighLightText(doc, "Employee: ", employee ? employee.name : "N/A", 15, 64);

  toHighLightText(
    doc,
    "Record No: ",
    employee ? employee.recordNo : "N/A",
    15,
    70
  );

  toHighLightText(doc, "Schedule: ", employee.schedule.name, 15, 76);
  toHighLightText(doc, "Date: ", date, 15, 82);
  const depText = `Department: ${employee?.department?.name || "N/A"}`;
  const catText = `Category: ${employee?.category || "N/A"}`;
  const depWidth = doc.getTextWidth(depText);
  const catWidth = doc.getTextWidth(catText);
  const rightMargin = 15;
  let xPosition_h = pageWidth - Math.max(depWidth, catWidth) - rightMargin;
  const tDaysText = `Number of Days: ${numDays || "N/A"}`;
  const tLateText = `Minutes of Late: ${totalLate || "N/A"}`;
  const tDaysWidth = doc.getTextWidth(tDaysText);
  const tLateWidth = doc.getTextWidth(tLateText);
  const xPosition_h1 =
    pageWidth - Math.max(tDaysWidth, tLateWidth) - rightMargin;
  xPosition_h = Math.max(xPosition_h, xPosition_h1) - rightMargin / 2;

  toHighLightText(
    doc,
    "Category: ",
    employee ? employee.category : "N/A",
    xPosition_h,
    64
  );

  toHighLightText(
    doc,
    "Department: ",
    employee?.department?.name || "N/A",
    xPosition_h,
    70
  );

  toHighLightText(
    doc,
    "Number of Days: ",
    `${numDays || "N/A"}`,
    xPosition_h,
    76
  );

  toHighLightText(
    doc,
    "Minutes of Late: ",
    `${totalLate || "N/A"}`,
    xPosition_h,
    82
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

  // === PAGE OVERFLOW HANDLER ===
  const BOTTOM_CONTENT_HEIGHT = 30;
  const pageHeight = doc.internal.pageSize.height;
  const remainingSpace = pageHeight - tableHeight - 20; // estimate needed for footer

  console.log("Remaining Space:", remainingSpace);
  console.log("Table Height:", tableHeight);
  console.log("Page Height:", pageHeight);

  if (remainingSpace < BOTTOM_CONTENT_HEIGHT) {
    doc.addPage();
    tableHeight = 20; // new starting Y on next page
  }

  const certText =
    "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 I HEREBY CERTIFY on my honor that the above is true and correct record of the hours of work performed, record of which was made daily at the time of arrival and departure from the office.";

  const wrappedText = doc.splitTextToSize(certText, pageWidth - 30);
  doc.text(wrappedText, 15, tableHeight + 10);

  const signatureY = tableHeight + 26;
  const sigLineWidth = 60;

  const centerX = 15;
  const rightX = pageWidth - 15 - sigLineWidth;

  doc.line(centerX, signatureY + 10, centerX + sigLineWidth, signatureY + 10);
  doc.setFontSize(10);
  const empSigLabel = "Employee's Signature";
  const empSigLabelWidth = doc.getTextWidth(empSigLabel);
  doc.text(
    empSigLabel,
    centerX + sigLineWidth / 2 - empSigLabelWidth / 2,
    signatureY + 16
  );

  doc.text("Verified as to the prescribed office hour.", rightX, signatureY);

  const headY = signatureY + 10;
  doc.line(rightX, headY, rightX + sigLineWidth, headY);
  const headLabel = "Head of Office";
  const headLabelWidth = doc.getTextWidth(headLabel);
  doc.text(
    headLabel,
    rightX + sigLineWidth / 2 - headLabelWidth / 2,
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
