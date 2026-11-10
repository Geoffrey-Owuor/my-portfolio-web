// This is an api route to manually revalidate the whole path (In this case the home path)
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isRevalidateAuthorized } from "@/lib/RevalidateAuth";

export async function POST(request) {
  if (!isRevalidateAuthorized(request)) {
    return NextResponse.json(
      { message: "Invalid token secret" },
      { status: 401 },
    );
  }

  try {
    // Clear the cache from home page
    revalidatePath("/");
    return NextResponse.json({
      revalidated: true,
      now: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error while invalidating the home page:", error);
    return NextResponse.json(
      { message: "Error while invalidating" },
      { status: 500 },
    );
  }
}
