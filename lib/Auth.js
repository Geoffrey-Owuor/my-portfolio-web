import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { query } from "./db";

const ACCESS_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET,
);

// Function for hashing passwords
export async function hashRefreshToken(token) {
  const signature = token.split(".")[2];
  return await bcrypt.hash(signature, 10);
}

// Function for verifying hashes
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function signAccessToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(ACCESS_SECRET);
}

export async function signRefreshToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);
}

// Verifying the access token quick check
export async function verifyAccessTokenJWT() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return null;

  try {
    const { payload } = await jwtVerify(accessToken, ACCESS_SECRET);
    return payload;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

// Verifying the refresh token quick check
export async function verifyRefreshTokenJWT(refreshToken) {
  try {
    const { payload } = await jwtVerify(refreshToken, REFRESH_SECRET);

    return payload;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

// Require session
export async function requireSession() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) return null;

  const payload = await verifyRefreshTokenJWT(refreshToken);
  if (!payload?.id) return null;

  const result = await query(
    `SELECT refresh_token FROM users WHERE id = $1 LIMIT 1`,
    [payload.id],
  );

  if (!result.length) return null;

  const hashedToken = result[0].refresh_token;

  if (!hashedToken) return null;

  // Split the token to get the signature
  const incomingSignature = refreshToken.split(".")[2];
  const isValid = await bcrypt.compare(incomingSignature, hashedToken);

  if (!isValid) return null;

  return payload;
}
