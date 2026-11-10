import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  invalidFields,
  invalidJson,
  notFound,
  readJson,
  requireOwner,
  serverError,
  unauthenticated,
} from "@/lib/manage/api";
import { getResource, insertRow } from "@/lib/manage/resources";
import { validateManageFields } from "@/utils/manageFields";

export async function POST(request, { params }) {
  const user = await requireOwner();
  if (!user) return unauthenticated();

  const { resource: name } = await params;
  const resource = getResource(name);
  if (!resource) return notFound();

  const body = await readJson(request);
  if (body === undefined) return invalidJson();

  const { values, errors } = validateManageFields(resource.fields, body);
  if (Object.keys(errors).length > 0) return invalidFields(errors);

  try {
    const { text, params: sqlParams } = insertRow(
      resource,
      Object.keys(values),
      Object.values(values),
    );
    const [row] = await query(text, sqlParams);
    revalidateTag(resource.tag);

    return NextResponse.json({ message: "Added", id: row.id }, { status: 201 });
  } catch (error) {
    console.error(`Failed to create ${name}:`, error);
    return serverError("Couldn't save that. Please try again.");
  }
}
