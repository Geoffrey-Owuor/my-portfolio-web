import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const protectedRoutes = ["/createblog"];

  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !refreshToken
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/createblog/:path*"],
};
