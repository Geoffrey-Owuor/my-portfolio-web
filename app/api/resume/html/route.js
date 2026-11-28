import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  readJson,
  requireOwner,
  serverError,
  unauthenticated,
} from "@/lib/manage/api";
import { extractResume } from "@/lib/ResumeExtract";
import {
  getCachedLatestResume,
  getResumeHtml,
  getResumeObject,
  putResumeHtml,
  RESUME_CACHE_TAG,
} from "@/lib/ResumeStorage";

// The résumé's HTML view, owner only. Both handlers act on the current PDF;
// a résumé uploaded in the meantime simply wins.

const noResume = () =>
  NextResponse.json(
    { message: "No résumé has been uploaded yet" },
    { status: 404 },
  );

// POST: reads the current PDF again and replaces its HTML view. For a PDF
// uploaded before there was one, or after the extraction improves. Keeps
// the view hidden if it was.
export async function POST() {
  if (!(await requireOwner())) return unauthenticated();

  try {
    const latest = await getCachedLatestResume();
    if (!latest) return noResume();

    const [object, current] = await Promise.all([
      getResumeObject(latest.key),
      getResumeHtml(latest.key),
    ]);
    const html = await extractResume(await object.Body.transformToByteArray());
    if (!html) {
      return NextResponse.json(
        {
          message:
            "No sections could be read from this PDF, so it has no web version",
        },
        { status: 422 },
      );
    }

    await putResumeHtml(latest.key, {
      ...html,
      ...(current?.hidden && { hidden: true }),
    });
    revalidateTag(RESUME_CACHE_TAG);
    return NextResponse.json({
      message: current
        ? "The web version has been rebuilt from the PDF"
        : "The web version is ready",
    });
  } catch (error) {
    console.error("Failed to rebuild the résumé's HTML view:", error);
    return serverError("Couldn't rebuild the web version. Please try again.");
  }
}

// PATCH { hidden: boolean }: shows or hides the HTML view on /resume. The
// owner still sees it in /manage either way.
export async function PATCH(request) {
  if (!(await requireOwner())) return unauthenticated();

  const body = await readJson(request);
  if (typeof body?.hidden !== "boolean") {
    return NextResponse.json(
      { message: "Expected { hidden: true | false }" },
      { status: 400 },
    );
  }

  try {
    const latest = await getCachedLatestResume();
    if (!latest) return noResume();

    const current = await getResumeHtml(latest.key);
    if (!current) {
      return NextResponse.json(
        { message: "This résumé has no web version yet" },
        { status: 404 },
      );
    }

    const { hidden, ...rest } = current;
    await putResumeHtml(
      latest.key,
      body.hidden ? { ...rest, hidden: true } : rest,
    );
    revalidateTag(RESUME_CACHE_TAG);
    return NextResponse.json({
      message: body.hidden
        ? "The web version is hidden from visitors"
        : "The web version is visible to visitors",
    });
  } catch (error) {
    console.error("Failed to update the résumé's HTML view:", error);
    return serverError("Couldn't update the web version. Please try again.");
  }
}
