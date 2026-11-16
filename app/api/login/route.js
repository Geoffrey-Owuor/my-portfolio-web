import { query } from "@/lib/db";
import {
  verifyPassword,
  signAccessToken,
  signRefreshToken,
  hashRefreshToken,
} from "@/lib/Auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clientIp, describeWait, rateLimit } from "@/lib/RateLimit";

const WRONG_CREDENTIALS = "Wrong username or password";

// Compared against when the email is unknown, so that answer takes as long as
// a wrong password and response times don't reveal which emails exist. It is
// the hash of a throwaway string, not of any real password.
const DUMMY_HASH =
  "$2b$10$CTZx15D9o6NE1QYZGthdQeWeQbVIonc7pb6fDj79j.CHXf4eqTu3G";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Without this, a missing password makes bcrypt throw and answers 500.
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    const { allowed, retryAfter } = await rateLimit(
      `login:${clientIp(request)}`,
      { limit: 10, windowSeconds: 15 * 60 },
    );
    if (!allowed) {
      return NextResponse.json(
        {
          message: `Too many sign-in attempts. Please try again in ${describeWait(retryAfter)}.`,
        },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }

    // Find user by email
    const query1 = `SELECT id, password, user_name 
                    FROM users
                    WHERE user_email = $1 LIMIT 1`;
    const params1 = [email];
    const result1 = await query(query1, params1);

    // Assign result to user
    const user = result1[0];

    // Verify password (against the dummy hash when there's no such user)
    const isValid = await verifyPassword(
      password,
      user?.password ?? DUMMY_HASH,
    );
    if (!user || !isValid) {
      return NextResponse.json({ message: WRONG_CREDENTIALS }, { status: 401 });
    }

    // Define the payload
    const payload = {
      id: user.id,
      name: user.user_name,
      email: email,
    };
    //Generate access tokens
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    // Hash refresh token and store it in the database
    const hashedRefreshToken = await hashRefreshToken(refreshToken);

    const query2 = `UPDATE users 
                    SET refresh_token = $1, 
                    refresh_token_expiry = NOW() + INTERVAL '7 days'
                    WHERE user_email = $2`;
    const params2 = [hashedRefreshToken, email];

    await query(query2, params2);

    // Set cookies
    const cookieStore = await cookies();

    // set access token
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, //15 minutes
    });

    // set refresh token
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Server Error, Please Try Again" },
      { status: 500 },
    );
  }
}
