const TOCSkeleton = () => (
  <nav className="sticky top-12 hidden max-h-[calc(100vh-5rem)] w-70 shrink-0 flex-col overflow-y-auto rounded-xl p-4 lg:flex">
    {/* "On this page" heading */}
    <div className="mb-4 border-b-2 border-gray-200 pb-2 dark:border-gray-800">
      <div className="h-3.5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
    </div>
    {/* TOC list items */}
    <div className="space-y-3">
      {[`full`, `3/4`, `5/6`, `full`, `4/5`, `2/3`].map((w, i) => (
        <div
          key={i}
          className={`h-4 w-${w} animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800`}
        />
      ))}
    </div>
  </nav>
);

export default TOCSkeleton;
