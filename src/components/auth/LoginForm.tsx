"use client";

import { login } from "@/actions/authActions";
import { LoginSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../ui/Button";

function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    setServerError(null);
    setIsLoggingIn(true);

    login(data)
      .then((result) => {
        if (result?.error) {
          setServerError(result.error || "Invalid login credentials");
        }

        setIsLoggingIn(false);
      })
      .catch((err) => {
        setServerError(err.message || "Invalid login credentials");
        setIsLoggingIn(false);
      });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full gap-2"
    >
      <label>Log In Credentials</label>
      <input
        type="email"
        placeholder="Email"
        className="py-2 pl-4 bg-transparent border-2 border-[var(--border)] rounded-md focus:outline focus:outline-blue-500"
        {...register("email")}
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
      <label>Password</label>
      <input
        type="password"
        placeholder="Password"
        className="py-2 pl-4 bg-transparent border-2 border-[var(--border)] rounded-md focus:outline focus:outline-blue-500"
        {...register("password")}
      />
      {errors.password && (
        <p style={{ color: "red" }}>{errors.password.message}</p>
      )}
      <div className="w-full flex flex-col gap-4">
        <Link
          href={"#"}
          className="text-blue-600 hover:text-[var(--blue)] cursor-pointer"
        >
          Forgot password?
        </Link>
        <Button
          label={isLoggingIn ? "Logging in..." : "Log In"}
          type="submit"
          isLoading={isLoggingIn}
        />
      </div>
      {serverError && <p style={{ color: "red" }}>{serverError}</p>}
    </form>
  );
}

export default LoginForm;
