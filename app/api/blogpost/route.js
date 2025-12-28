import { query } from "@/lib/db";
import { verifyAccessTokenJWT } from "@/lib/Auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, author, content, tagline, readTime } = await request.json();

    if (!title || !author || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const user = await verifyAccessTokenJWT();

    if (!user) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 401 },
      );
    }

    const blogQuery = `INSERT INTO blogs 
                       (user_id, blog_title, blog_author, blog_date, read_time, blog_content, author_tagline)
                       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6)`;
    const blogParams = [user.id, title, author, readTime, content, tagline];

    await query(blogQuery, blogParams);

    return NextResponse.json(
      { message: "Your blog has been posted successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error while posting blog:", error);
    return NextResponse.json(
      { message: "Error while posting your blog" },
      { status: 500 },
    );
  }
}
