import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

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

export async function verifyRefreshToken(token) {
  try {
    const payload = jwtVerify(token, REFRESH_SECRET);
    return payload;
  } catch (error) {
    return {}; //Return an empty object on error
  }
}
