// Mirrors SectionTitle's geometry (h2, subtitle row, rule, and the
// mb-8) so a streamed-in section doesn't shift.
const SectionTitleSkeleton = () => (
  <div className="mb-8" aria-hidden="true">
    <div className="bg-border-subtle rounded-chip h-8 w-48 animate-pulse" />
    <div className="bg-border-subtle rounded-chip mt-2.5 h-4 w-40 animate-pulse" />
    <div className="bg-border-rule bleed-rails mt-5 h-px" />
  </div>
);

export default SectionTitleSkeleton;
