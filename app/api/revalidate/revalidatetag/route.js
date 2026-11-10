// Api endpoint for revalidating a specific tag
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { isRevalidateAuthorized } from "@/lib/RevalidateAuth";

export async function POST(request) {
  if (!isRevalidateAuthorized(request)) {
    return NextResponse.json(
      { message: "Invalid token secret" },
      { status: 401 },
    );
  }

  const tag = request.nextUrl.searchParams.get("tag");

  if (!tag) {
    return NextResponse.json(
      { message: "Missing tag parameter" },
      { status: 400 },
    );
  }

  try {
    revalidateTag(tag);
    return NextResponse.json({
      revalidated: true,
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error while invalidating tag "${tag}":`, error);
    return NextResponse.json(
      { message: "Error while invalidating" },
      { status: 500 },
    );
  }
}
