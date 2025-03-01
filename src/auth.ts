import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authCredentials } from "@/lib/zod";
import { login } from "@/lib/actions/authService";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        let user = null;

        const parsedCredentials = authCredentials.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error("Invalid credentials:", parsedCredentials.error.errors);
          return null;
        }
        // get user

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required");
        }

        const result = await login({
          email: credentials.email,
          password: credentials.password,
        });

        console.log(result);

        if (!user) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
