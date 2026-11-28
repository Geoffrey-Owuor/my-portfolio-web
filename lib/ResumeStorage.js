import {
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { unstable_cache } from "next/cache";
import { BUCKET, s3 } from "@/lib/ObjectStorage";

// The résumé lives in Neon Object Storage (S3-compatible, private bucket).
// Each upload gets a fresh key under resume/, so the newest key is always the
// current version; /resume/file streams it from our own origin, which keeps
// the public link stable whatever happens to the stored object. Beside each
// PDF sits resume/<same name>.json: the text pulled out of it for the HTML
// view (lib/ResumeExtract.js), plus whether the owner has hidden that view.

export const RESUME_PREFIX = "resume/";
export const RESUME_FILENAME = "Geoffrey-Owuor-Resume.pdf";
export const RESUME_CACHE_TAG = "resume";
export const RESUME_MAX_BYTES = 4 * 1024 * 1024; // under Vercel's 4.5 MB body cap

const listObjects = async () => {
  const { Contents = [] } = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: RESUME_PREFIX }),
  );
  return Contents;
};

const listResumes = async () =>
  // Newest first. Keys are resume/<epoch-ms>.pdf, so LastModified and key
  // order agree; LastModified is the tie-breaker-free source of truth.
  (await listObjects())
    .filter((object) => object.Key?.endsWith(".pdf"))
    .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));

const htmlKeyFor = (pdfKey) => pdfKey.replace(/\.pdf$/, ".json");

const getLatestResume = async () => {
  const [latest] = await listResumes();
  if (!latest) return null;
  return {
    key: latest.Key,
    size: latest.Size,
    updatedAt: new Date(latest.LastModified).toISOString(),
  };
};

const cachedLatestResume = unstable_cache(getLatestResume, ["latestResume"], {
  tags: [RESUME_CACHE_TAG],
});

// Resolves to { key, size, updatedAt }, to null when nothing has been
// uploaded yet, and throws when storage can't be reached — so callers can
// tell "no résumé yet" apart from "couldn't load it". Failures are thrown
// inside the cache, so a failed read is never stored.
export const getCachedLatestResume = () => cachedLatestResume();

export const getResumeObject = (key) =>
  s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));

export const putResume = async (body) => {
  const key = `${RESUME_PREFIX}${Date.now()}.pdf`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: "application/pdf",
      ContentDisposition: `inline; filename="${RESUME_FILENAME}"`,
    }),
  );
  return key;
};

// Saves the HTML view's content for the PDF stored at `pdfKey`.
export const putResumeHtml = (pdfKey, content) =>
  s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: htmlKeyFor(pdfKey),
      Body: JSON.stringify(content),
      ContentType: "application/json",
    }),
  );

// Resolves to { version, blocks, hidden? }, or to null when the PDF has no
// HTML view (it was uploaded before there was one, or nothing usable could
// be read from it). Throws when storage can't be reached.
export const getResumeHtml = async (pdfKey) => {
  try {
    const object = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: htmlKeyFor(pdfKey) }),
    );
    return JSON.parse(await object.Body.transformToString());
  } catch (error) {
    if (error?.name === "NoSuchKey") return null;
    throw error;
  }
};

// Keyed by the PDF, so a new upload never reads the previous one's entry.
export const getCachedResumeHtml = (pdfKey) =>
  unstable_cache(() => getResumeHtml(pdfKey), ["resumeHtml", pdfKey], {
    tags: [RESUME_CACHE_TAG],
  })();

// Removes every stored version except `keepKey` and its HTML content.
// Best-effort: a leftover old version is harmless (the newest one is always
// served), so failures are logged rather than surfaced.
export const deleteOlderResumes = async (keepKey) => {
  const keep = new Set([keepKey, htmlKeyFor(keepKey)]);
  try {
    const stale = (await listObjects()).filter((o) => !keep.has(o.Key));
    if (stale.length === 0) return;
    await s3.send(
      new DeleteObjectsCommand({
        Bucket: BUCKET,
        Delete: { Objects: stale.map(({ Key }) => ({ Key })), Quiet: true },
      }),
    );
  } catch (error) {
    console.error("Failed to delete older résumé versions:", error);
  }
};
