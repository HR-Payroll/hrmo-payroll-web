"use server";
import * as XLSX from "xlsx";
import path from "path";
import { getAllReport } from "@/data/report";
import { getAllSummary } from "@/data/payroll";

export const downloadSummary = async (
  from: Date,
  to: Date,
  category?: string,
  department?: string
) => {
  try {
    const reports = await getAllSummary(from, to, category, department);

    const fs = await import("fs");
    const templatePath = path.join(
      process.cwd(),
      "public",
      "templates/payroll_template.xlsx"
    );

    console.log(templatePath);
    if (!fs.existsSync(templatePath)) {
      throw new Error("Template file not found");
    }

    const fileBuffer = fs.readFileSync(templatePath);
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

    console.log(reportDepartments);

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
        worksheet[`D${rowStart + rowIndex}`] = { v: employee.type };
        worksheet[`E${rowStart + rowIndex}`] = { v: totalDays };
        worksheet[`F${rowStart + rowIndex}`] = { v: earnings };
        worksheet[`G${rowStart + rowIndex}`] = { v: deductions };
        worksheet[`H${rowStart + rowIndex}`] = { v: earnings - deductions };
        worksheet[`AC${rowStart + rowIndex}`] = { v: deductions };
        worksheet[`AE${rowStart + rowIndex}`] = { v: net };
      });
    });

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
