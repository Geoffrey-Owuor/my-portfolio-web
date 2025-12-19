// This is an api route to manually revalidate the whole path (In this case the home path)
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Get current date and time
const date = new Date().toLocaleString();

export async function GET(request) {
  // Next.js way
  const secret = request.nextUrl.searchParams.get("secret");

  // Security Check
  if (!secret || secret !== process.env.REVALIDATE_KEY) {
    return NextResponse.json(
      { message: "Invalid token secret" },
      { status: 401 },
    );
  }

  try {
    // Clear the cache from home page
    revalidatePath("/");
    return NextResponse.json({ revalidated: true, now: date });
  } catch (error) {
    return NextResponse.json(
      { message: "Error while invalidating" },
      { status: 500 },
    );
  }
}
