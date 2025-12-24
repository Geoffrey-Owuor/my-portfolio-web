import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyRefreshTokenJWT } from "@/lib/Auth";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) {
    try {
      const { payload } = await verifyRefreshTokenJWT(refreshToken);

      if (payload?.id) {
        await query(
          `UPDATE users
           SET refresh_token = NULL,
               refresh_token_expiry = NULL
           WHERE id = $1`,
          [payload.id],
        );
      }
    } catch {
      // Token expired / invalid → ignore
      // Client-side logout still proceeds
    }
  }

  /**
   * CLIENT LOGOUT (AUTHORITATIVE)
   */
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
