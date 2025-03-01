import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "./lib/zod";
import { prisma } from "../prisma/prisma";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validateData = LoginSchema.safeParse(credentials);

        if (!validateData.success) return null;

        const { email, password } = validateData.data;

        const user = await prisma.user.findFirst({
          where: { email },
        });

        if (!user) return null;

        const passwordMatch = password === user.password;

        if (passwordMatch) return user;

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
