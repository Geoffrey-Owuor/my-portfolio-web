import { query } from "@/lib/db";
import { verifyAccessTokenJWT } from "@/lib/Auth";
import { notifyIndexNow } from "@/lib/IndexNow";
import { revalidateTag } from "next/cache";
import { after, NextResponse } from "next/server";
import { validateBlog } from "@/utils/blogFields";
import { estimateReadTime } from "@/utils/Helpers";

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

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Expected a JSON body" },
        { status: 400 },
      );
    }

    // The editor always sends the whole post, so an edit replaces every
    // field: that is what lets a tagline be cleared.
    const { values, errors } = validateBlog(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { message: "Please check the highlighted fields.", errors },
        { status: 400 },
      );
    }

    const blogUpdateQuery = `UPDATE blogs SET
                            blog_title = $1,
                            blog_author = $2,
                            blog_content = $3,
                            author_tagline = $4,
                            read_time = $5,
                            updated_at = NOW()
                            WHERE id = $6 AND user_id = $7
                            RETURNING id, slug
                           `;
    const blogUpdateParams = [
      values.title,
      values.author,
      values.content,
      values.tagline,
      estimateReadTime(values.content),
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
