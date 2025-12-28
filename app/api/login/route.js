import { query } from "@/lib/db";
import {
  verifyPassword,
  signAccessToken,
  signRefreshToken,
  hashRefreshToken,
} from "@/lib/Auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Find user by email
    const query1 = `SELECT id, password, user_name 
                    FROM users
                    WHERE user_email = $1 LIMIT 1`;
    const params1 = [email];
    const result1 = await query(query1, params1);

    if (!result1.length) {
      return NextResponse.json(
        { message: "wrong username or password" },
        { status: 401 },
      );
    }

    // Assign result to user
    const user = result1[0];

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Wrong username or password" },
        { status: 401 },
      );
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Server Error, Please Try Again" },
      { status: 500 },
    );
  }
}
