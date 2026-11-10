import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

// Neon Object Storage (S3-compatible, private bucket). Everything stored here
// is served through our own origin.
export const BUCKET = process.env.NEON_STORAGE_BUCKET;

// Reused across HMR in development, like the Postgres pool in lib/db.js.
const createClient = () =>
  new S3Client({
    region: process.env.NEON_STORAGE_REGION,
    endpoint: process.env.NEON_STORAGE_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.NEON_STORAGE_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEON_STORAGE_SECRET_ACCESS_KEY,
    },
    // Neon's S3 API doesn't need the SDK's default request/response checksums.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

export const s3 =
  process.env.NODE_ENV === "production"
    ? createClient()
    : (globalThis.neonS3Client ??= createClient());
