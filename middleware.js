import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET,
);

const middleware = async (request) => {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthenticated = false;

  if (accessToken) {
    try {
      await jwtVerify(accessToken, ACCESS_SECRET);
      isAuthenticated = true;
    } catch {}
  }

  if (!isAuthenticated && refreshToken) {
    try {
      await jwtVerify(refreshToken, REFRESH_SECRET);
      isAuthenticated = true;
    } catch {}
  }

  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/createblog", request.url));
  }

  // LOGIC: If user tries to access protected routes but is NOT authenticated
  const protectedRoutes = ["/createblog"];
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};

export default middleware;

// Limit middleware to only run on specific paths for performance
export const config = {
  matcher: ["/login", "/createblog/:path*"],
};
