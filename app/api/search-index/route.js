// Titles for the ⌘K command palette — fetched lazily the first time the
// palette opens, so the layout itself never touches the database. Reads go
// through the same tagged caches as the homepage and /blogs, so a revalidate
// of either tag refreshes this too.
import { NextResponse } from "next/server";
import { getCachedProjects } from "@/cache/CachedData";
import { BlogsData } from "@/cache/BlogsData";

export async function GET() {
  const [projects, blogs] = await Promise.all([
    getCachedProjects(),
    BlogsData(),
  ]);

  return NextResponse.json({
    projects: (projects ?? []).map(({ id, project_name }) => ({
      id,
      title: project_name,
    })),
    blogs: (blogs ?? []).map(({ id, slug, blog_title }) => ({
      id,
      slug,
      title: blog_title,
    })),
  });
}
