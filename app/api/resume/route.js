import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { verifyAccessTokenJWT } from "@/lib/Auth";
import {
  deleteOlderResumes,
  putResume,
  RESUME_CACHE_TAG,
  RESUME_MAX_BYTES,
} from "@/lib/ResumeStorage";

// Replaces the résumé: stores the uploaded PDF as the newest version, drops
// the older ones and refreshes the cached lookup behind /resume/file.
export async function POST(request) {
  const user = await verifyAccessTokenJWT();
  if (!user) {
    return NextResponse.json(
      { message: "User is not authenticated" },
      { status: 401 },
    );
  }

  let file;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return NextResponse.json(
      { message: "Expected a PDF upload" },
      { status: 400 },
    );
  }

  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  if (file.size > RESUME_MAX_BYTES) {
    return NextResponse.json(
      { message: "The PDF must be 4 MB or smaller" },
      { status: 413 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  // Check the file's signature, not just its name or reported type.
  const isPdf = new TextDecoder().decode(bytes.subarray(0, 5)) === "%PDF-";
  if (!isPdf) {
    return NextResponse.json(
      { message: "That file isn't a PDF" },
      { status: 415 },
    );
  }

  try {
    const key = await putResume(bytes);
    await deleteOlderResumes(key);
    revalidateTag(RESUME_CACHE_TAG);

    return NextResponse.json(
      { message: "Your résumé has been updated" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error while uploading the résumé:", error);
    return NextResponse.json(
      { message: "Couldn't upload your résumé. Please try again." },
      { status: 500 },
    );
  }
}
