import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  invalidFields,
  invalidJson,
  isValidId,
  notFound,
  readJson,
  requireOwner,
  serverError,
  unauthenticated,
} from "@/lib/manage/api";
import { deleteRow, getResource, updateRow } from "@/lib/manage/resources";
import { deleteProjectImage } from "@/lib/ProjectImages";
import { validateManageFields } from "@/utils/manageFields";

export async function PUT(request, { params }) {
  const user = await requireOwner();
  if (!user) return unauthenticated();

  const { resource: name, id } = await params;
  const resource = getResource(name);
  if (!resource || !isValidId(id)) return notFound();

  const body = await readJson(request);
  if (body === undefined) return invalidJson();

  const { values, errors } = validateManageFields(resource.fields, body);
  if (Object.keys(errors).length > 0) return invalidFields(errors);

  try {
    const { text, params: sqlParams } = updateRow(
      resource,
      Object.keys(values),
      Object.values(values),
      id,
    );
    const rows = await query(text, sqlParams);
    if (rows.length === 0) return notFound();

    revalidateTag(resource.tag);
    return NextResponse.json({ message: "Saved" });
  } catch (error) {
    console.error(`Failed to update ${name} ${id}:`, error);
    return serverError("Couldn't save that. Please try again.");
  }
}

export async function DELETE(_request, { params }) {
  const user = await requireOwner();
  if (!user) return unauthenticated();

  const { resource: name, id } = await params;
  const resource = getResource(name);
  if (!resource || !isValidId(id)) return notFound();

  try {
    const { text, params: sqlParams } = deleteRow(resource, id);
    const rows = await query(text, sqlParams);
    if (rows.length === 0) return notFound();

    revalidateTag(resource.tag);
    // Only after the row is gone, so a live page never loses its image.
    if (resource.imageColumn) await deleteProjectImage(rows[0].deleted);

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(`Failed to delete ${name} ${id}:`, error);
    return serverError("Couldn't delete that. Please try again.");
  }
}
