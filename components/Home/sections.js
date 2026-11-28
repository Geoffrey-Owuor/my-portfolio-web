// Homepage sections in page order — the single source for the navbar tabs,
// scroll-spy and the command palette (which shows each section's index). `id`
// must match the id on the corresponding <section>. `nav: false` keeps a
// section out of the navbar tabs (it's still in the palette).
export const sections = [
  { id: "skills", label: "Skills" },
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "activity", label: "Activity" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  // The navbar already has a Blogs tab, so this one stays out of the tabs.
  { id: "writing", label: "Writing", nav: false },
  { id: "contact", label: "Contact" },
].map((section, i) => ({
  ...section,
  href: `/#${section.id}`,
  index: String(i + 1).padStart(2, "0"),
}));

export const getSection = (id) => sections.find((section) => section.id === id);
