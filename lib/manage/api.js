import "server-only";
import { NextResponse } from "next/server";
import { verifyAccessTokenJWT } from "@/lib/Auth";

// The real check behind every /api/manage mutation; the middleware matcher is
// only a convenience. Call it before reading the request body.
export const requireOwner = () => verifyAccessTokenJWT();

export const unauthenticated = () =>
  NextResponse.json({ message: "User is not authenticated" }, { status: 401 });

export const notFound = () =>
  NextResponse.json({ message: "Not found" }, { status: 404 });

export const serverError = (message) =>
  NextResponse.json({ message }, { status: 500 });

export const invalidJson = () =>
  NextResponse.json({ message: "Expected a JSON body" }, { status: 400 });

export const invalidFields = (errors) =>
  NextResponse.json(
    { message: "Please check the highlighted fields.", errors },
    { status: 400 },
  );

// Anything else would make Postgres reject the integer parameter.
export const isValidId = (id) => /^\d{1,9}$/.test(String(id));

// Resolves to undefined when the body isn't JSON.
export const readJson = async (request) => {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
};
