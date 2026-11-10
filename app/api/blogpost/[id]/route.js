import { query } from "@/lib/db";
import { verifyAccessTokenJWT } from "@/lib/Auth";
import { notifyIndexNow } from "@/lib/IndexNow";
import { revalidateTag } from "next/cache";
import { after, NextResponse } from "next/server";

const unauthenticated = () =>
  NextResponse.json({ message: "User is not authenticated" }, { status: 401 });

const notFound = () =>
  NextResponse.json(
    { message: "Blog not found or access denied" },
    { status: 404 },
  );

// Anything else would make Postgres reject the integer parameter.
const isValidId = (id) => /^\d{1,9}$/.test(id);

export async function PUT(request, { params }) {
  try {
    const user = await verifyAccessTokenJWT();
    if (!user) return unauthenticated();

    const { id } = await params;
    if (!isValidId(id)) return notFound();

    const { title, author, content, tagline, readTime } = await request.json();

    if (!title && !author && !content && !tagline && !readTime) {
      return NextResponse.json(
        { message: "No fields provided for update" },
        { status: 400 },
      );
    }

    const blogUpdateQuery = `UPDATE blogs SET
                            blog_title = COALESCE($1, blog_title),
                            blog_author = COALESCE($2, blog_author),
                            blog_content = COALESCE($3, blog_content),
                            author_tagline = COALESCE($4, author_tagline),
                            read_time = COALESCE($5, read_time)
                            WHERE id = $6 AND user_id = $7
                            RETURNING id, slug
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

    if (rows.length === 0) return notFound();

    revalidateTag("BlogsData");
    after(() => notifyIndexNow([`/blog/${rows[0].slug}`]));

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

export async function DELETE(_request, { params }) {
  try {
    const user = await verifyAccessTokenJWT();
    if (!user) return unauthenticated();

    const { id } = await params;
    if (!isValidId(id)) return notFound();

    const rows = await query(
      "DELETE FROM blogs WHERE id = $1 AND user_id = $2 RETURNING slug",
      [id, user.id],
    );

    if (rows.length === 0) return notFound();

    revalidateTag("BlogsData");
    // IndexNow also covers removals: engines recrawl and find the 404.
    after(() => notifyIndexNow([`/blog/${rows[0].slug}`, "/blogs"]));

    return NextResponse.json(
      { message: "Your blog has been deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error while deleting the blog:", error);
    return NextResponse.json(
      { message: "Error encountered while deleting the blog" },
      { status: 500 },
    );
  }
}
