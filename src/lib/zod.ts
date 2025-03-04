import { object, string } from "zod";

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
  name: string()
    .min(3, { message: "Department name must be at least 3 characters long!" })
    .max(20, {
      message: "Department name must be at most 20 characters long!",
    }),
  category: string().min(1, "Category is required"),
});
