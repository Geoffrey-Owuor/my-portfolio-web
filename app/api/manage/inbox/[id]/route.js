import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  invalidJson,
  isValidId,
  notFound,
  readJson,
  requireOwner,
  serverError,
  unauthenticated,
} from "@/lib/manage/api";

// Body: { read: boolean }.
export async function PATCH(request, { params }) {
  const user = await requireOwner();
  if (!user) return unauthenticated();

  const { id } = await params;
  if (!isValidId(id)) return notFound();

  const body = await readJson(request);
  if (body === undefined) return invalidJson();
  if (typeof body?.read !== "boolean") {
    return NextResponse.json(
      { message: "Expected read to be true or false" },
      { status: 400 },
    );
  }

  try {
    const rows = await query(
      `UPDATE user_feedback
       SET read_at = CASE WHEN $1::boolean THEN COALESCE(read_at, NOW()) END
       WHERE id = $2
       RETURNING read_at`,
      [body.read, id],
    );
    if (rows.length === 0) return notFound();

    return NextResponse.json({ read_at: rows[0].read_at });
  } catch (error) {
    console.error(`Failed to update message ${id}:`, error);
    return serverError("Couldn't update that message. Please try again.");
  }
}

export async function DELETE(_request, { params }) {
  const user = await requireOwner();
  if (!user) return unauthenticated();

  const { id } = await params;
  if (!isValidId(id)) return notFound();

  try {
    const rows = await query(
      `DELETE FROM user_feedback WHERE id = $1 RETURNING id`,
      [id],
    );
    if (rows.length === 0) return notFound();

    return NextResponse.json({ message: "Message deleted" });
  } catch (error) {
    console.error(`Failed to delete message ${id}:`, error);
    return serverError("Couldn't delete that message. Please try again.");
  }
}
