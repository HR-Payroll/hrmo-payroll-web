"use server";

import { z } from "zod";
import { signIn, signOut } from "../auth";
import { AuthError } from "next-auth";
import { LoginSchema } from "@/lib/zod";
import { error } from "console";
import { prisma } from "@/../prisma/prisma";

export async function login(data: z.infer<typeof LoginSchema>) {
  const validateData = LoginSchema.parse(data);

  if (!validateData) {
    return { error: "Invalid input credentials" };
  }

  const { email, password } = validateData;

  const userExists = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!userExists) {
    return { error: "No user found with that email." };
  }

  try {
    await signIn("credentials", {
      email: userExists.email,
      password: password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong, try again" };
      }
    }

    throw error;
  }

  return { success: "User logged in successfully!" };
}

export async function logOut() {
  await signOut();
}
