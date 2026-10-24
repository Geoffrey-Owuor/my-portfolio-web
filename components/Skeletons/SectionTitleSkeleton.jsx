// Mirrors SectionTitle's geometry (index, h2, subtitle row, rule, and the
// mb-8) so a streamed-in section doesn't shift.
const SectionTitleSkeleton = () => (
  <div className="mb-8" aria-hidden="true">
    <div className="flex items-start gap-3 md:gap-4">
      <div className="bg-border-subtle rounded-chip mt-2 h-4 w-5 animate-pulse" />
      <div className="min-w-0 flex-1">
        <div className="bg-border-subtle rounded-chip h-8 w-48 animate-pulse" />
        <div className="bg-border-subtle rounded-chip mt-2.5 h-4 w-40 animate-pulse" />
      </div>
    </div>
    <div className="bg-border-subtle mt-5 h-px" />
  </div>
);

export default SectionTitleSkeleton;
