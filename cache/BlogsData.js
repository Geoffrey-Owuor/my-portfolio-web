"use server";
import { query } from "@/lib/db";
export async function BlogsData() {
  const blogsQuery = `
    SELECT id, blog_title, blog_author, blog_date, read_time, blog_content
    FROM blogs
    ORDER BY blog_date DESC
    `;
  try {
    const blogs = await query(blogsQuery);
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs data:", error);
    return [];
  }
}
