// The public site's caches, as /manage's "Refresh site" control offers them.
// Edits made in /manage refresh their own section already; this is for
// changes made elsewhere (a direct database edit, a new GitHub push) or a
// cache that went stale. The route only ever revalidates tags from this list.
export const SITE_CACHES = [
  { id: "projects", label: "Projects", tags: ["projects"] },
  { id: "experience", label: "Experience", tags: ["experiences"] },
  { id: "education", label: "Education", tags: ["education"] },
  { id: "skills", label: "Skills", tags: ["skills"] },
  { id: "stack", label: "Stack", tags: ["toolNames"] },
  { id: "blogs", label: "Blogs", tags: ["BlogsData"] },
  { id: "resume", label: "Résumé", tags: ["resume"] },
  { id: "github", label: "GitHub activity", tags: ["GitHubData"] },
];

// `null` (no section) means every cache. Unknown ids resolve to undefined.
export const getSiteCacheTags = (id) => {
  if (id == null) return SITE_CACHES.flatMap((cache) => cache.tags);
  return SITE_CACHES.find((cache) => cache.id === id)?.tags;
};
