import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  hashPassword,
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
} from "@/lib/Auth";
import {
  invalidFields,
  invalidJson,
  readJson,
  requireOwner,
  serverError,
  unauthenticated,
} from "@/lib/manage/api";
import { describeWait, rateLimit } from "@/lib/RateLimit";
import { newPasswordError } from "@/utils/passwordRules";

// Changes the owner's password. A wrong current password answers 400, never
// 401: the client treats a 401 as an expired session and signs out.
export async function PUT(request) {
  const owner = await requireOwner();
  if (!owner) return unauthenticated();

  const body = await readJson(request);
  if (!body) return invalidJson();

  const { currentPassword, newPassword } = body;
  const errors = {};
  if (typeof currentPassword !== "string" || !currentPassword) {
    errors.currentPassword = "Enter your current password.";
  }
  const newError = newPasswordError(newPassword);
  if (newError) errors.newPassword = newError;
  if (Object.keys(errors).length > 0) return invalidFields(errors);

  // Keyed by user: someone holding a stolen session mustn't be able to keep
  // guessing the current password.
  const { allowed, retryAfter } = await rateLimit(`password:${owner.id}`, {
    limit: 5,
    windowSeconds: 15 * 60,
  });
  if (!allowed) {
    return NextResponse.json(
      {
        message: `Too many attempts. Please try again in ${describeWait(retryAfter)}.`,
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  try {
    const [user] = await query(
      `SELECT id, user_name, user_email, password FROM users WHERE id = $1`,
      [owner.id],
    );
    if (!user) return unauthenticated();

    if (!(await verifyPassword(currentPassword, user.password))) {
      return invalidFields({
        currentPassword: "That isn't your current password.",
      });
    }
    if (await verifyPassword(newPassword, user.password)) {
      return invalidFields({
        newPassword:
          "Choose a password that's different from your current one.",
      });
    }

    // A fresh refresh token, saved with the new hash, keeps this browser
    // signed in and revokes every other session.
    const payload = {
      id: user.id,
      name: user.user_name,
      email: user.user_email,
    };
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    await query(
      `UPDATE users
       SET password = $1,
           refresh_token = $2,
           refresh_token_expiry = NOW() + INTERVAL '7 days'
       WHERE id = $3`,
      [
        await hashPassword(newPassword),
        await hashRefreshToken(refreshToken),
        user.id,
      ],
    );

    const cookieStore = await cookies();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };
    cookieStore.set("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60,
    });
    cookieStore.set("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error changing the password:", error);
    return serverError("Couldn't change your password. Please try again.");
  }
}
