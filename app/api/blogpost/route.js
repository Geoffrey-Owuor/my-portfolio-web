import { query } from "@/lib/db";
import { verifyAccessTokenJWT } from "@/lib/Auth";
import { createBlogSlug } from "@/lib/BlogSlug";
import { notifyIndexNow } from "@/lib/IndexNow";
import { revalidateTag } from "next/cache";
import { after, NextResponse } from "next/server";
import { validateBlog } from "@/utils/blogFields";
import { estimateReadTime } from "@/utils/markdownText";

export async function POST(request) {
  try {
    const user = await verifyAccessTokenJWT();

    if (!user) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 401 },
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Expected a JSON body" },
        { status: 400 },
      );
    }

    const { values, errors } = validateBlog(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { message: "Please check the highlighted fields.", errors },
        { status: 400 },
      );
    }

    const blogQuery = `INSERT INTO blogs
                       (user_id, blog_title, blog_author, blog_date, read_time, blog_content, author_tagline, slug)
                       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6, $7)`;
    const slug = await createBlogSlug(values.title);
    const blogParams = [
      user.id,
      values.title,
      values.author,
      // Worked out here, so it always matches the stored content.
      estimateReadTime(values.content),
      values.content,
      values.tagline,
      slug,
    ];

    await query(blogQuery, blogParams);

    revalidateTag("BlogsData");
    after(() => notifyIndexNow([`/blog/${slug}`, "/blogs"]));

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
