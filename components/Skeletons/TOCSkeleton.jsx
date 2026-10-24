const TOCSkeleton = () => (
  <nav className="rounded-card sticky top-[calc(var(--header-h)+1rem)] hidden max-h-[calc(100dvh-var(--header-h)-2rem)] w-70 shrink-0 flex-col overflow-y-auto p-4 lg:flex">
    {/* "On this page" heading */}
    <div className="border-border-subtle mb-4 border-b-2 pb-2">
      <div className="bg-border-subtle rounded-chip h-3.5 w-24 animate-pulse" />
    </div>
    {/* TOC list items */}
    <div className="space-y-3">
      {[`full`, `3/4`, `5/6`, `full`, `4/5`, `2/3`].map((w, i) => (
        <div
          key={i}
          className={`bg-border-subtle h-4 w-${w} rounded-chip animate-pulse`}
        />
      ))}
    </div>
  </nav>
);

export default TOCSkeleton;
