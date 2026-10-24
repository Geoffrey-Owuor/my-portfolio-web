// Homepage sections in page order — the single source for the navbar tabs,
// scroll-spy, the command palette, and each SectionTitle's index number. `id`
// must match the id on the corresponding <section>. `nav: false` keeps a
// section out of the navbar tabs (it's still numbered and in the palette).
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
