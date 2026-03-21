import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET,
);

// A simple middleware
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // --- 1. PROTECTED ROUTES LOGIC (Redirect to Login) ---
  if (pathname.startsWith("/createblog")) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // --- 2. HEADER INJECTION LOGIC (For Blog/Public Pages) ---
  const response = NextResponse.next();

  if (refreshToken) {
    if (pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/createblog", request.url));
    }
    try {
      // Use jwtVerify (Edge-compatible) with your Refresh Secret
      const { payload } = await jwtVerify(refreshToken, REFRESH_SECRET);

      if (payload) {
        // Inject metadata into headers for Server Components to read
        response.headers.set("x-user-id", String(payload.id || ""));
        response.headers.set("x-user-name", String(payload.name || ""));
        response.headers.set("x-user-email", String(payload.email || ""));
      }
    } catch (error) {
      // If refresh token is expired/invalid, we just let them browse as a guest
      console.error("Middleware Auth Check Failed:", error.message);
    }
  }

  return response;
}

export const config = {
  // This ensures the middleware ONLY runs on these paths
  matcher: ["/createblog", "/login", "/blogs", "/blog/:path*"],
};
