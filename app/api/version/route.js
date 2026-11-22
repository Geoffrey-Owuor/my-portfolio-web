import { NextResponse } from "next/server";

// Never cached: an open tab compares this with the deployment it loaded from
// (see Modules/DeploymentWatcher). The value is baked in at build time, so
// whichever deployment answers reports itself.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { deploymentId: process.env.NEXT_PUBLIC_DEPLOYMENT_ID || null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
