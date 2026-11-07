import {
  getCachedLatestResume,
  getResumeObject,
  RESUME_FILENAME,
} from "@/lib/ResumeStorage";

// The stable résumé link: always the newest uploaded PDF, served from our own
// origin so it opens in the browser tab (and PDF.js can fetch it without
// CORS). `?download=1` asks for a download instead of inline display.
export const dynamic = "force-dynamic";

export async function GET(request) {
  let latest;
  try {
    latest = await getCachedLatestResume();
  } catch (error) {
    console.error("Failed to look up the résumé:", error);
    return new Response("Résumé temporarily unavailable", { status: 503 });
  }

  if (!latest) {
    return new Response("No résumé has been uploaded yet", { status: 404 });
  }

  // The key changes on every upload, so it doubles as a strong ETag.
  const etag = `"${latest.key}"`;
  const download = new URL(request.url).searchParams.has("download");
  const headers = {
    "Content-Type": "application/pdf",
    "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${RESUME_FILENAME}"`,
    // Revalidate every time: replacing the file must show up immediately,
    // and an unchanged file costs only a 304.
    "Cache-Control": "no-cache",
    ETag: etag,
    "Last-Modified": new Date(latest.updatedAt).toUTCString(),
  };

  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers });
  }

  try {
    const object = await getResumeObject(latest.key);
    return new Response(object.Body.transformToWebStream(), {
      headers: { ...headers, "Content-Length": String(object.ContentLength) },
    });
  } catch (error) {
    console.error("Failed to fetch the résumé:", error);
    return new Response("Résumé temporarily unavailable", { status: 503 });
  }
}
