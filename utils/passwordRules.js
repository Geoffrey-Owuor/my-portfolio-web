// Rules for a new owner password, shared by the change-password form and
// PUT /api/manage/password so both give the same answer.

export const PASSWORD_MIN_CHARS = 12;
// bcrypt reads only the first 72 bytes and silently ignores the rest, so a
// longer password would be weaker than it looks.
export const PASSWORD_MAX_BYTES = 72;

const byteLength = (value) => new TextEncoder().encode(value).length;

// Resolves to an error message, or null when `password` is acceptable.
export const newPasswordError = (password) => {
  if (typeof password !== "string" || !password) {
    return "Enter a new password.";
  }
  if ([...password].length < PASSWORD_MIN_CHARS) {
    return `Use at least ${PASSWORD_MIN_CHARS} characters.`;
  }
  if (byteLength(password) > PASSWORD_MAX_BYTES) {
    return "That's too long. Use a shorter password (up to about 70 characters).";
  }
  return null;
};
