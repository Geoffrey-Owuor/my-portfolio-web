import { NextResponse } from "next/server";

// A simple middleware
export function middleware(request) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 2. Simply check if the token is missing
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // This ensures the middleware ONLY runs on these paths
  matcher: ["/createblog/:path*"],
};
