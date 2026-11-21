import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  invalidJson,
  readJson,
  requireOwner,
  serverError,
  unauthenticated,
} from "@/lib/manage/api";
import { getSiteCacheTags } from "@/utils/siteCaches";

// Body: { section } to refresh one part of the public site, or {} for all of
// it. Tags come from the fixed list in utils/siteCaches.js, never from the
// request.
export async function POST(request) {
  const user = await requireOwner();
  if (!user) return unauthenticated();

  const body = await readJson(request);
  if (body === undefined) return invalidJson();

  const section = body?.section ?? null;
  const tags =
    typeof section === "string" || section === null
      ? getSiteCacheTags(section)
      : undefined;
  if (!tags) {
    return NextResponse.json({ message: "Unknown section" }, { status: 400 });
  }

  try {
    tags.forEach((tag) => revalidateTag(tag));
    return NextResponse.json({ message: "Refreshed" });
  } catch (error) {
    console.error("Failed to refresh the site cache:", error);
    return serverError("Couldn't refresh the site. Please try again.");
  }
}
