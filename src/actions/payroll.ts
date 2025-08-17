"use server";
import * as XLSX from "xlsx";
import { getAllSummary } from "@/data/payroll";
import { dateQuery } from "@/utils/dateFormatter";
import { format } from "date-fns";

export const downloadSummary = async (
  from: Date,
  to: Date,
  category?: string,
  department?: string
) => {
  try {
    const { dateFrom, dateTo } = dateQuery(
      format(from, "yyyy-MM-dd"),
      format(to, "yyyy-MM-dd")
    );
    const reports = await getAllSummary(dateFrom, dateTo, category, department);

    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_CLIENT_URL || ""
      }/templates/payroll_template.xlsx`
    );

    const fileBuffer = await res.arrayBuffer();
    const workbook = XLSX.read(fileBuffer, {
      type: "array",
      cellStyles: true,
    });

    const rowStart = 5;
    const templateSheetName = workbook.SheetNames[0];
    const templateSheet = workbook.Sheets[templateSheetName];

    const reportDepartments = reports?.reduce((acc, report) => {
      const departmentName = report.department?.name || "Unknown";
      if (!acc[departmentName]) {
        acc[departmentName] = [];
      }
      acc[departmentName].push(report);
      return acc;
    }, {} as Record<string, typeof reports>);

    Object.keys(reportDepartments).forEach((departmentName) => {
      const worksheet = JSON.parse(JSON.stringify(templateSheet));
      workbook.SheetNames.push(departmentName);
      workbook.Sheets[departmentName] = worksheet;

      const reports = reportDepartments[departmentName];

      reports?.forEach((report: any, index: number) => {
        const {
          recordNo,
          name,
          items,
          employee,
          totalDays,
          earnings,
          net,
          late,
          deductions,
        } = report;
        const rowIndex = index + 1;

        worksheet[`A${rowStart + rowIndex}`] = { v: rowIndex };
        worksheet[`B${rowStart + rowIndex}`] = { v: name.name };
        worksheet[`C${rowStart + rowIndex}`] = { v: employee.rate };
        worksheet[`D${rowStart + rowIndex}`] = {
          v: employee.type ? employee.type.toUpperCase() : "",
        };
        worksheet[`E${rowStart + rowIndex}`] = { v: totalDays };
        worksheet[`F${rowStart + rowIndex}`] = { v: earnings };
        worksheet[`G${rowStart + rowIndex}`] = { v: deductions };
        worksheet[`H${rowStart + rowIndex}`] = { v: net };
        worksheet[`AC${rowStart + rowIndex}`] = { v: deductions };
        worksheet[`AE${rowStart + rowIndex}`] = { v: net };
      });
    });

    delete workbook.Sheets[templateSheetName];
    const index = workbook.SheetNames.indexOf(templateSheetName);
    if (index > -1) {
      workbook.SheetNames.splice(index, 1);
    }

    return XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong, please try again later." };
  }
};
