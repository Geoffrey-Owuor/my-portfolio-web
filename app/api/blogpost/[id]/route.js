import { query } from "@/lib/db";
import { verifyAccessTokenJWT } from "@/lib/Auth";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { title, author, content, tagline, readTime } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Blog id is required" },
        { status: 400 },
      );
    }

    if (!title && !author && !content && !tagline && !readTime) {
      return NextResponse.json(
        { message: "No fields provided for update" },
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
    const blogUpdateQuery = `UPDATE blogs SET 
                            blog_title = COALESCE($1, blog_title),
                            blog_author = COALESCE($2, blog_author),
                            blog_content = COALESCE($3, blog_content),
                            author_tagline = COALESCE($4, author_tagline),
                            read_time = COALESCE($5, read_time)
                            WHERE id = $6 AND user_id = $7
                            RETURNING id
                           `;
    const blogUpdateParams = [
      title,
      author,
      content,
      tagline,
      readTime,
      id,
      user.id,
    ];

    const rows = await query(blogUpdateQuery, blogUpdateParams);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Blog not found or access denied" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Your blog has been updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error while updating the blog:", error);
    return NextResponse.json(
      { message: "Error encountered while updating the blog" },
      { status: 500 },
    );
  }
}
