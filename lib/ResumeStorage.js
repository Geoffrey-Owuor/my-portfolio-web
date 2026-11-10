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
// the public link stable whatever happens to the stored object.

export const RESUME_PREFIX = "resume/";
export const RESUME_FILENAME = "Geoffrey-Owuor-Resume.pdf";
export const RESUME_CACHE_TAG = "resume";
export const RESUME_MAX_BYTES = 4 * 1024 * 1024; // under Vercel's 4.5 MB body cap

const listResumes = async () => {
  const { Contents = [] } = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: RESUME_PREFIX }),
  );
  // Newest first. Keys are resume/<epoch-ms>.pdf, so LastModified and key
  // order agree; LastModified is the tie-breaker-free source of truth.
  return Contents.filter((object) => object.Key?.endsWith(".pdf")).sort(
    (a, b) => new Date(b.LastModified) - new Date(a.LastModified),
  );
};

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

// Removes every stored version except `keepKey`. Best-effort: a leftover old
// version is harmless (the newest one is always served), so failures are
// logged rather than surfaced.
export const deleteOlderResumes = async (keepKey) => {
  try {
    const stale = (await listResumes()).filter((o) => o.Key !== keepKey);
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
