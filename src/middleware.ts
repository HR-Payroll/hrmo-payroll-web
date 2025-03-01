import authConfig from "./auth.config";
import NextAuth from "next-auth";

const URL = process.env.CLIENT_URL;

const { auth } = NextAuth(authConfig);
export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isPrivateRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = nextUrl.pathname.includes("/login");
  const isApiRoute = nextUrl.pathname.includes("/api");

  if (isApiRoute) return;
  if (isLoggedIn && isAuthRoute) return Response.redirect(`${URL}/dashboard`);
  if (!isLoggedIn && isAuthRoute) return;
  if (!isLoggedIn && isPrivateRoute) return Response.redirect(`${URL}/login`);
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
