// Api endpoint for revalidating a specific tag
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Get current date and time
const date = new Date().toLocaleString();

export async function GET(request) {
  // Getting the search Params Object
  const { searchParams } = request.nextUrl;

  // Getting the values in search params
  const { secret, tag } = Object.fromEntries(searchParams);

  // Security Check
  if (!secret || secret !== process.env.REVALIDATE_KEY) {
    return NextResponse.json(
      { message: "Invalid token secret" },
      { status: 401 },
    );
  }

  //   Check if the tag is available
  if (!tag) {
    return NextResponse.json(
      { message: "Missing tag parameter" },
      { status: 401 },
    );
  }

  try {
    // Revalidate tag
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, time: date });
  } catch (error) {
    return NextResponse.json(
      { message: "Error while invalidating" },
      { status: 500 },
    );
  }
}
