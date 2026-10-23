// Homepage sections in page order — the single source for the navbar tabs,
// scroll-spy, and each SectionTitle's index number. `id` must match the id on
// the corresponding <section>.
export const sections = [
  { id: "skills", label: "Skills" },
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "activity", label: "Activity" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
].map((section, i) => ({
  ...section,
  href: `/#${section.id}`,
  index: String(i + 1).padStart(2, "0"),
}));

export const getSection = (id) => sections.find((section) => section.id === id);
