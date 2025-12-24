import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyRefreshTokenJWT } from "@/lib/Auth";

// For logging out everywhere
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) {
    try {
      const payload = await verifyRefreshTokenJWT(refreshToken);

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
      console.error("Logout DB update failed:", error);
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
