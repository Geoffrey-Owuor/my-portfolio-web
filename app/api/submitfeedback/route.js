import { query } from "@/lib/db";
import { after, NextResponse } from "next/server";
import { sendMail } from "@/lib/SendMail";
import { clientIp, describeWait, rateLimit } from "@/lib/RateLimit";
import { validateContact } from "@/utils/contactValidation";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Expected a JSON body" },
      { status: 400 },
    );
  }

  const errors = validateContact(body ?? {});
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { message: "Please check the highlighted fields.", errors },
      { status: 400 },
    );
  }

  const { allowed, retryAfter } = await rateLimit(
    `contact:${clientIp(request)}`,
    { limit: 5, windowSeconds: 60 * 60 },
  );
  if (!allowed) {
    return NextResponse.json(
      {
        message: `That's a lot of messages. Please try again in ${describeWait(retryAfter)}.`,
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const contactInfo = body.contactInfo.trim();
  const message = body.message.trim();

  try {
    await query(
      `INSERT INTO user_feedback (user_identity, feedback_description)
       VALUES ($1, $2)`,
      [contactInfo, message],
    );

    // Sent after the response, but still inside the invocation: an un-awaited
    // promise can be frozen with the function before the email goes out.
    after(() => sendMail({ contactInfo, message }));

    return NextResponse.json(
      { message: "Message received! I'll get back to you soon😊" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
