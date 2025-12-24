import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { query } from "./db";

const ACCESS_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET,
);

// Function for hashing passwords
export async function hashRefreshToken(password) {
  return await bcrypt.hash(password, 10);
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

// 1. Quick Access Token check (Stateless)
export async function verifyAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload;
  } catch (err) {
    return null; // Token expired or invalid
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

// Verifying the refresh token (the long security way)
export async function verifyRefreshToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) return null;
  try {
    const { payload } = await jwtVerify(refreshToken, REFRESH_SECRET);

    if (!payload?.id) return null;

    // 2. Fetch the hashed token from the database
    const sql = `SELECT refresh_token, refresh_token_expiry FROM users WHERE id = $1 LIMIT 1`;
    const result = await query(sql, [payload.id]);

    if (result.length === 0) return null;

    const dbUser = result[0];

    // 4. Compare the cookie token with the hashed token in the DB
    const isMatch = await bcrypt.compare(refreshToken, dbUser.refresh_token);

    if (!isMatch) return null;

    // Return the payload so the layout/UI can use the user info
    return payload;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}
