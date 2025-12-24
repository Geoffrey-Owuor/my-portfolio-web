import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyRefreshToken } from "@/lib/Auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const payload = await verifyRefreshToken();

    if (payload?.id) {
      // 2. Invalidate the token in the Database
      // This ensures the token can never be used again even if it hasn't expired
      await query(
        `UPDATE users 
           SET refresh_token = NULL, 
               refresh_token_expiry = NULL 
           WHERE id = $1`,
        [payload.id],
      );
    }

    // 3. Clear the cookies from the browser
    // We set maxAge to 0 to tell the browser to delete them immediatel
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { message: "Server Error during logout" },
      { status: 500 },
    );
  }
}
