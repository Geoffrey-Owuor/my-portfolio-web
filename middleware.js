import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET,
);

// A simple middleware
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Verify once, up front. Redirect decisions must hinge on a *valid* token,
  // not a present one: a stale/expired cookie used to bounce /login →
  // /createblog, whose requireSession() rejected it and bounced straight
  // back — an infinite redirect loop.
  let payload = null;
  if (refreshToken) {
    try {
      // Use jwtVerify (Edge-compatible) with your Refresh Secret
      ({ payload } = await jwtVerify(refreshToken, REFRESH_SECRET));
    } catch (error) {
      // If refresh token is expired/invalid, we just let them browse as a guest
      console.error("Middleware Auth Check Failed:", error.message);
    }
  }

  // --- 1. PROTECTED ROUTES LOGIC (Redirect to Login) ---
  if (pathname.startsWith("/createblog") && !payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // --- 2. Already signed in: skip the login page ---
  if (pathname.startsWith("/login") && payload) {
    return NextResponse.redirect(new URL("/createblog", request.url));
  }

  // --- 3. HEADER INJECTION LOGIC (For Blog/Public Pages) ---
  const response = NextResponse.next();

  if (payload) {
    // Inject metadata into headers for Server Components to read
    response.headers.set("x-user-id", String(payload.id || ""));
  }

  return response;
}

export const config = {
  // This ensures the middleware ONLY runs on these paths
  matcher: ["/createblog", "/login", "/blog/:path*"],
};
