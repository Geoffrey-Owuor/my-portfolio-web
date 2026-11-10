import { getProjectImage, isProjectImageName } from "@/lib/ProjectImages";

const notFound = () => new Response("Image not found", { status: 404 });

// Streams a project image from the private bucket. Names are never reused, so
// browsers and the image optimizer can keep a response forever.
export async function GET(_request, { params }) {
  const { name } = await params;
  if (!isProjectImageName(name)) return notFound();

  try {
    const object = await getProjectImage(name);
    return new Response(object.Body.transformToWebStream(), {
      headers: {
        "Content-Type": object.ContentType,
        "Content-Length": String(object.ContentLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) {
      return notFound();
    }
    console.error(`Failed to fetch project image ${name}:`, error);
    return new Response("Image temporarily unavailable", { status: 503 });
  }
}
