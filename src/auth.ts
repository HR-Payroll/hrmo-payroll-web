import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../prisma/prisma";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role,
        },
      };
    },
  },
});
