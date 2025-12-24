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
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    //Checked against the database stored token to ensure it has not been revoked/replaced
    const dbQuery = `SELECT id, user_name, user_email, refresh_token FROM users WHERE id = $1`;
    const rows = await query(dbQuery, [payload.id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    const hashedToken = rows[0].refresh_token;
    const userId = rows[0].id;
    const userName = rows[0].user_name;
    const userEmail = rows[0].user_email;

    if (!hashedToken) {
      return NextResponse.json({ message: "Token not found" }, { status: 401 });
    }

    // Compare cookie token with db hash using verifyPassword
    const isTokenValid = await verifyPassword(refreshToken, hashedToken);

    if (!isTokenValid) {
      await query(`UPDATE users SET refresh_token = NULL WHERE id = $1`, [
        userId,
      ]);

      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      return NextResponse.json(
        { message: "Session invalidated" },
        { status: 401 },
      );
    }
    // Generate new tokens
    const newPayload = {
      id: userId,
      name: userName,
      email: userEmail,
    };

    const newAccessToken = await signAccessToken(newPayload);
    const newRefreshToken = await signRefreshToken(newPayload);

    // Update db with new refresh token hash
    const newHashedRT = await hashRefreshToken(newRefreshToken);

    const query2 = `UPDATE users 
                        SET refresh_token = $1, 
                        refresh_token_expiry = NOW() + INTERVAL '7 days'
                        WHERE id = $2`;
    await query(query2, [newHashedRT, userId]);

    // Set new cookies
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
