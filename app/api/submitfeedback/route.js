import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/SendMail";

export async function POST(request) {
  const { contactInfo, message } = await request.json();

  if (!contactInfo || !message) {
    return NextResponse.json(
      { message: "Message to be sent is missing" },
      { status: 401 },
    );
  }

  try {
    const insertQuery = `INSERT INTO user_feedback (user_identity, feedback_description)
  VALUES ($1, $2)`;
    const params = [contactInfo, message];

    await query(insertQuery, params);

    // Call the sendMail function
    sendMail({ contactInfo, message });

    // 3. Send success response
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
