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

  // An edit counts as a change, so the edit date wins when there is one.
  const lastChanged = (blog) => {
    const date = blog.updated_at ?? blog.blog_date;
    return date ? new Date(date) : undefined;
  };

  // The listing changes when any post is published or edited.
  const blogDates = (blogs ?? []).map(lastChanged).filter(Boolean);
  const latestBlogDate = blogDates.length
    ? new Date(Math.max(...blogDates))
    : undefined;

  const staticRoutes = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: latestBlogDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${SITE_URL}/resume`, changeFrequency: "monthly", priority: 0.8 },
  ];

  const blogRoutes = (blogs ?? []).map((blog) => ({
    url: `${SITE_URL}/blog/${blog.slug}`,
    lastModified: lastChanged(blog),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projectRoutes = (projects ?? []).map((project) => ({
    url: `${SITE_URL}/projects/${project.id}`,
    // Only known once a project has been edited.
    lastModified: project.updated_at ? new Date(project.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
