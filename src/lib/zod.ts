import { z, date, number, object, string, boolean, array } from "zod";

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
  rate: z.coerce.number().min(1, "Rate is required"),
  type: string().min(1, "Type is required"),
});

export const MandatorySchema = object({
  category: string().min(1, "Category is required"),
  department: string().min(1, "Department is required"),
  employee: string().min(1, "Employee is required"),
  gsisgs: number().min(1, "GSIS-GS is required"),
  ec: number().min(1, "EC is required"),
  gsisps: number().min(1, "GSIS-PS is required"),
  phic: number().min(1, "PHIC is required"),
  hdmfgs: number().min(1, "HDMF-GS is required"),
  hdmfps: number().min(1, "HDMF-PS is required"),
  wtax: number().min(1, "WTax is required"),
  sss: number().min(1, "SSS is required"),
});

export const LoanSchema = object({
  category: string().min(1, "Category is required"),
  department: string().min(1, "Department is required"),
  employee: string().min(1, "Employee is required"),
  mplhdmf: number().min(1, "MPL-HDMF is required"),
  gfal: number().min(1, "GFAL is required"),
  landbank: number().min(1, "Landbank is required"),
  cb: number().min(1, "CB is required"),
  eml: number().min(1, "EML is required"),
  mplgsis: number().min(1, "MPL-GSIS is required"),
  tagum: number().min(1, "Tagum Bank is required"),
  ucpb: number().min(1, "UCPB is required"),
  mpllite: number().min(1, "MPL-LITE is required"),
  sb: number().min(1, "SB is required"),
});

export const ReportSchema = object({
  recordNo: string().min(1, "Record Number is required"),
  name: string().min(1, "Employee name is required"),
  timestamp: string().min(1, "Timestamp is required"),
  index: string().min(1, "Index is required"),
});

export const EventSchema = object({
  name: string().min(1, "Event name is required"),
  startDate: string().min(1, "Start date is required"),
  endDate: date(),
  type: string().min(1, "Type is required"),
  applied: boolean().default(true).optional(),
  rule: number().default(1).optional(),
});

const validateTime = (inTime: Date, outTime: Date): boolean => {
  return inTime.getTime() < outTime.getTime();
};

export const ScheduleSchema = object({
  name: string().min(1, "Schedule name is required"),
  inTime: date({ required_error: "In Time is required" }),
  outTime: date({ required_error: "Out Time is required" }),
  daysIncluded: array(string()).min(1, "Please include a day"),
  readOnly: boolean().default(false).optional(),
}).refine((data) => validateTime(data.inTime, data.outTime), {
  message: "In Time must be less than Out Time",
  path: ["inTime"],
});
