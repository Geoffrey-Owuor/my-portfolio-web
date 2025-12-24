import { query } from "@/lib/db";
import {
  verifyRefreshTokenJWT,
  signAccessToken,
  signRefreshToken,
  hashRefreshToken,
  verifyPassword,
} from "@/lib/Auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  try {
    // Verify jwt signature of the refresh token
    const payload = await verifyRefreshTokenJWT(refreshToken);

    // If payload is empty or invalid
    if (!payload || !payload.id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    //Checked against the database stored token to ensure it has not been revoked/replaced
    const dbQuery = `SELECT id, user_name, user_email, refresh_token FROM users WHERE id = $1`;
    const user = await query(dbQuery, [payload.id]);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    // Compare cookie token with db hash using verifyPassword
    const isTokenValid = await verifyPassword(refreshToken, user.refresh_token);

    //If token is not valid
    if (!isTokenValid) {
      return NextResponse.json({ message: "Token mismatch" }, { status: 401 });
    }

    // Generate new tokens
    const newPayload = {
      id: user.id,
      name: user.user_name,
      email: user.user_email,
    };

    const newAccessToken = await signAccessToken(newPayload);
    const newRefreshToken = await signRefreshToken(newPayload);

    // Update db with new refresh token hash
    const newHashedRT = await hashRefreshToken(newRefreshToken);

    const query2 = `UPDATE users 
                        SET refresh_token = $1, 
                        refresh_token_expiry = NOW() + INTERVAL '7 days'
                        WHERE id = $2`;
    await query(query2, [newHashedRT, user.id]);

    // Set new cookies
    // 6. Set new Cookies
    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
    });

    cookieStore.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 401 });
  }
}
