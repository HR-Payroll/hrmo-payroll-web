import { date, object, string } from "zod";

export const LoginSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" }).min(
    1,
    "Password is required"
  ),
});

export const DepartmentSchema = object({
  name: string().min(1, "Department name is required"),
  category: string().min(1, "Category is required"),
  index: string(),
});

export const EmployeeSchema = object({
  recordNo: string().min(1, "Record Number is required"),
  name: string()
    .min(3, { message: "Employee name must be at least 3 characters long!" })
    .max(100, {
      message: "Employee name must be at most 20 characters long!",
    }),
  category: string().min(1, "Category is required"),
  department: string().optional(),
});

export const RateSchema = object({
  category: string().min(1, "Category is required"),
  department: string().min(1, "Department is required"),
  employee: string().min(1, "Employee is required"),
  rate: string().min(1, "Rate is required"),
  type: string().min(1, "Type is required"),
});

export const MandatorySchema = object({
  category: string().min(1, "Category is required"),
  department: string().min(1, "Department is required"),
  employee: string().min(1, "Employee is required"),
  gsisgs: string().min(1, "GSIS-GS is required"),
  ec: string().min(1, "EC is required"),
  gsisps: string().min(1, "GSIS-PS is required"),
  phic: string().min(1, "PHIC is required"),
  hdmfgs: string().min(1, "HDMF-GS is required"),
  hdmfps: string().min(1, "HDMF-PS is required"),
  wtax: string().min(1, "WTax is required"),
  sss: string().min(1, "SSS is required"),
});

export const LoanSchema = object({
  category: string().min(1, "Category is required"),
  department: string().min(1, "Department is required"),
  employee: string().min(1, "Employee is required"),
  mplhdmf: string().min(1, "MPL-HDMF is required"),
  gfal: string().min(1, "GFAL is required"),
  landbank: string().min(1, "Landbank is required"),
  cb: string().min(1, "CB is required"),
  eml: string().min(1, "EML is required"),
  mplgsis: string().min(1, "MPL-GSIS is required"),
  tagum: string().min(1, "Tagum Bank is required"),
  ucpb: string().min(1, "UCPB is required"),
  mpllite: string().min(1, "MPL-LITE is required"),
  sb: string().min(1, "SB is required"),
});

export const ReportSchema = object({
  recordNo: string().min(1, "Record Number is required"),
  name: string().min(1, "Employee name is required"),
  timestamp: date(),
  index: string().min(1, "Index is required"),
});
