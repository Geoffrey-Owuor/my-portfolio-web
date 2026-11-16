import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireOwner, serverError, unauthenticated } from "@/lib/manage/api";

// The Inbox tab's badge. Read through the access token like the inbox itself.
export async function GET() {
  const user = await requireOwner();
  if (!user) return unauthenticated();

  try {
    const [{ unread }] = await query(
      `SELECT COUNT(*)::int AS unread FROM user_feedback WHERE read_at IS NULL`,
    );
    return NextResponse.json(
      { unread },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to count unread messages:", error);
    return serverError("Couldn't count unread messages.");
  }
}
