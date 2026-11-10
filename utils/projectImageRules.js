// Project image rules, shared by the form and the upload route.
export const PROJECT_IMAGE_MAX_BYTES = 4 * 1024 * 1024; // under Vercel's 4.5 MB body cap
export const PROJECT_IMAGE_TYPES = [
  "image/webp",
  "image/png",
  "image/jpeg",
  "image/avif",
];
export const PROJECT_IMAGE_TOO_LARGE = "The image must be 4 MB or smaller.";
export const PROJECT_IMAGE_WRONG_TYPE =
  "Choose a WebP, PNG, JPEG or AVIF image.";

// Returns a message, or null when the file can be sent to the server.
export const checkProjectImage = (file) => {
  if (!PROJECT_IMAGE_TYPES.includes(file.type)) return PROJECT_IMAGE_WRONG_TYPE;
  if (file.size > PROJECT_IMAGE_MAX_BYTES) return PROJECT_IMAGE_TOO_LARGE;
  return null;
};
