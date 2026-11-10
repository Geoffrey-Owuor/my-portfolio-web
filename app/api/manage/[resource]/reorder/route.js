import { revalidateTag } from "next/cache";
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
import { getResource, reorderRows } from "@/lib/manage/resources";

const MAX_ROWS = 500;

// Body: { ids: [...] }, the table's full id list in its new display order.
export async function PUT(request, { params }) {
  const user = await requireOwner();
  if (!user) return unauthenticated();

  const { resource: name } = await params;
  const resource = getResource(name);
  if (!resource?.placement) return notFound();

  const body = await readJson(request);
  if (body === undefined) return invalidJson();

  const submitted = body?.ids;
  const valid =
    Array.isArray(submitted) &&
    submitted.length > 0 &&
    submitted.length <= MAX_ROWS &&
    submitted.every(isValidId);
  const ids = valid ? submitted.map(Number) : [];

  if (!valid || new Set(ids).size !== ids.length) {
    return NextResponse.json(
      { message: "Expected the full list of ids" },
      { status: 400 },
    );
  }

  try {
    const { text, params: sqlParams } = reorderRows(resource, ids);
    const rows = await query(text, sqlParams);

    // No rows: the list no longer matches the table.
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "This list has changed. Reload and try again." },
        { status: 409 },
      );
    }

    revalidateTag(resource.tag);
    return NextResponse.json({ message: "Order saved" });
  } catch (error) {
    console.error(`Failed to reorder ${name}:`, error);
    return serverError("Couldn't save the new order. Please try again.");
  }
}
