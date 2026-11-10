import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  isValidId,
  notFound,
  requireOwner,
  serverError,
  unauthenticated,
} from "@/lib/manage/api";
import {
  deleteProjectImage,
  detectImageType,
  putProjectImage,
} from "@/lib/ProjectImages";
import {
  PROJECT_IMAGE_MAX_BYTES,
  PROJECT_IMAGE_TOO_LARGE,
  PROJECT_IMAGE_WRONG_TYPE,
} from "@/utils/projectImageRules";

// Points the project at `path` and resolves to the row's previous image, or
// to undefined when there is no such project.
const swapImage = async (id, path) => {
  const rows = await query(
    `UPDATE projects AS target
     SET project_image = $1
     FROM (SELECT id, project_image FROM projects WHERE id = $2 FOR UPDATE) AS previous
     WHERE target.id = previous.id
     RETURNING previous.project_image AS previous_image`,
    [path, id],
  );
  return rows.length === 0 ? undefined : { previous: rows[0].previous_image };
};

// Replaces the image. The database changes first and the old object goes
// after: a leftover object is harmless, a missing one breaks the page.
export async function POST(request, { params }) {
  const user = await requireOwner();
  if (!user) return unauthenticated();

  const { id } = await params;
  if (!isValidId(id)) return notFound();

  let file;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return NextResponse.json(
      { message: "Expected an image upload" },
      { status: 400 },
    );
  }

  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }
  if (file.size > PROJECT_IMAGE_MAX_BYTES) {
    return NextResponse.json(
      { message: PROJECT_IMAGE_TOO_LARGE },
      { status: 413 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectImageType(bytes);
  if (!type) {
    return NextResponse.json(
      { message: PROJECT_IMAGE_WRONG_TYPE },
      { status: 415 },
    );
  }

  // Set once a new object exists that no row points at yet.
  let unusedPath = null;
  try {
    const path = await putProjectImage(bytes, type);
    unusedPath = path;

    const swapped = await swapImage(id, path);
    if (!swapped) {
      await deleteProjectImage(path);
      return notFound();
    }
    unusedPath = null;

    revalidateTag("projects");
    await deleteProjectImage(swapped.previous);

    return NextResponse.json({ message: "Image saved", path }, { status: 201 });
  } catch (error) {
    console.error(`Failed to save the image for project ${id}:`, error);
    await deleteProjectImage(unusedPath);
    return serverError("Couldn't save the image. Please try again.");
  }
}

export async function DELETE(_request, { params }) {
  const user = await requireOwner();
  if (!user) return unauthenticated();

  const { id } = await params;
  if (!isValidId(id)) return notFound();

  try {
    const swapped = await swapImage(id, null);
    if (!swapped) return notFound();

    revalidateTag("projects");
    await deleteProjectImage(swapped.previous);

    return NextResponse.json({ message: "Image removed" });
  } catch (error) {
    console.error(`Failed to remove the image for project ${id}:`, error);
    return serverError("Couldn't remove the image. Please try again.");
  }
}
