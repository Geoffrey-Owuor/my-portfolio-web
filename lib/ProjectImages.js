import "server-only";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { BUCKET, s3 } from "@/lib/ObjectStorage";

// Project screenshots live under project-images/ in the private bucket, and
// /project-images/<name> streams them. A name is never reused, so the route
// can be cached permanently. projects.project_image stores that URL path.
const PREFIX = "project-images/";
const URL_PREFIX = "/project-images/";
const NAME_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(webp|png|jpg|avif)$/;

const startsWith = (bytes, signature, offset = 0) =>
  signature.every((byte, i) => bytes[offset + i] === byte);

const ascii = (text) => [...text].map((char) => char.charCodeAt(0));

// Reads the file's signature; the reported type and name prove nothing.
export const detectImageType = (bytes) => {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { contentType: "image/png", extension: "png" };
  }
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }
  if (startsWith(bytes, ascii("RIFF")) && startsWith(bytes, ascii("WEBP"), 8)) {
    return { contentType: "image/webp", extension: "webp" };
  }
  if (
    startsWith(bytes, ascii("ftyp"), 4) &&
    (startsWith(bytes, ascii("avif"), 8) || startsWith(bytes, ascii("avis"), 8))
  ) {
    return { contentType: "image/avif", extension: "avif" };
  }
  return null;
};

export const isProjectImageName = (name) => NAME_PATTERN.test(name);

export const getProjectImage = (name) =>
  s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: `${PREFIX}${name}` }));

// Stores the image and resolves to its project_image path.
export const putProjectImage = async (bytes, { contentType, extension }) => {
  const name = `${crypto.randomUUID()}.${extension}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: `${PREFIX}${name}`,
      Body: bytes,
      ContentType: contentType,
    }),
  );
  return `${URL_PREFIX}${name}`;
};

// Best-effort, and only ever for a stored image: a project can still point at
// a file under public/. A leftover object is harmless, so failures are logged.
export const deleteProjectImage = async (path) => {
  if (!path?.startsWith(URL_PREFIX)) return;
  const name = path.slice(URL_PREFIX.length);
  if (!isProjectImageName(name)) return;

  try {
    await s3.send(
      new DeleteObjectCommand({ Bucket: BUCKET, Key: `${PREFIX}${name}` }),
    );
  } catch (error) {
    console.error(`Failed to delete project image ${name}:`, error);
  }
};
