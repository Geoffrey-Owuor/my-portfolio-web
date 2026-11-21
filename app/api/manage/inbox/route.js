import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireOwner, serverError, unauthenticated } from "@/lib/manage/api";
import { parseInboxPageSize } from "@/utils/inboxPaging";

// Visitors' contact details, so this is read through the access token: a
// logged-out or replaced session fails here and goes through the refresh flow.
export async function GET(request) {
  const user = await requireOwner();
  if (!user) return unauthenticated();

  const { searchParams } = new URL(request.url);
  const requested = searchParams.get("page") ?? "1";
  const page = /^[1-9]\d{0,5}$/.test(requested) ? Number(requested) : 1;
  const pageSize = parseInboxPageSize(searchParams.get("pageSize"));

  try {
    const [messages, [{ total, unread }]] = await Promise.all([
      // Messages from before created_at existed have no date and sort last.
      query(
        `SELECT id, user_identity, feedback_description, created_at, read_at
         FROM user_feedback
         ORDER BY created_at DESC NULLS LAST, id DESC
         LIMIT $1 OFFSET $2`,
        [pageSize, (page - 1) * pageSize],
      ),
      query(
        `SELECT COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE read_at IS NULL)::int AS unread
         FROM user_feedback`,
      ),
    ]);

    return NextResponse.json(
      { messages, total, unread, page, pageSize },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to read the inbox:", error);
    return serverError("Couldn't load the inbox. Please try again.");
  }
}
