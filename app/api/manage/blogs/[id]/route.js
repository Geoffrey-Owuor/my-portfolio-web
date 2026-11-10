import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  isValidId,
  notFound,
  requireOwner,
  serverError,
  unauthenticated,
} from "@/lib/manage/api";

// The whole post, fetched when the editor opens so the /manage page doesn't
// carry every article's text.
export async function GET(_request, { params }) {
  const user = await requireOwner();
  if (!user) return unauthenticated();

  const { id } = await params;
  if (!isValidId(id)) return notFound();

  try {
    const rows = await query(
      `SELECT id AS blog_id, blog_title, blog_author, blog_content, author_tagline
       FROM blogs WHERE id = $1 AND user_id = $2`,
      [id, user.id],
    );
    if (rows.length === 0) return notFound();

    return NextResponse.json(rows[0], {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(`Failed to read blog ${id}:`, error);
    return serverError("Couldn't load that blog. Please try again.");
  }
}
