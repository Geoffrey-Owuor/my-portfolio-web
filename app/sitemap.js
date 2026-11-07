import { BlogsData } from "@/cache/BlogsData";
import { getCachedProjects } from "@/cache/CachedData";
import { SITE_URL } from "@/utils/metadata";

// Rebuilt when the blog/project cache tags are revalidated; the hourly
// revalidate is only a backstop.
export const revalidate = 3600;

export default async function sitemap() {
  // Both readers resolve to null on a failed read — fall back to the static
  // routes rather than failing the whole sitemap.
  const [blogs, projects] = await Promise.all([
    BlogsData(),
    getCachedProjects(),
  ]);

  const latestBlogDate = blogs?.[0]?.blog_date
    ? new Date(blogs[0].blog_date)
    : undefined;

  const staticRoutes = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: latestBlogDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const blogRoutes = (blogs ?? []).map((blog) => ({
    url: `${SITE_URL}/blog/${blog.id}`,
    lastModified: blog.blog_date ? new Date(blog.blog_date) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projectRoutes = (projects ?? []).map((project) => ({
    url: `${SITE_URL}/projects/${project.id}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
