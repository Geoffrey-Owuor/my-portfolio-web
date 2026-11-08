import { NextResponse } from "next/server";
import { requireSession } from "@/lib/Auth";

// Tells cached public pages whether to show owner-only controls. It only hides
// or shows UI: every mutation verifies the session in its own route handler.
export async function GET() {
  const session = await requireSession();

  return NextResponse.json(
    { signedIn: Boolean(session) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
