// Stands in for BlogForm inside BlogModal while a post loads for editing:
// three labelled inputs, the markdown editor (toolbar + 16-row textarea) and
// the action buttons, at the sizes of the real controls.
const bar = "bg-border-subtle animate-pulse";

const Label = ({ width }) => (
  <div className="mb-2 flex h-5 items-center gap-2">
    <div className={`${bar} rounded-chip h-4 w-4`} />
    <div className={`${bar} rounded-chip h-3.5 ${width}`} />
  </div>
);

const BlogFormSkeleton = () => {
  return (
    <div
      className="p-6 sm:p-8"
      role="status"
      aria-label="Loading the blog"
      aria-busy="true"
    >
      <div className="space-y-6" aria-hidden="true">
        {[
          ["w-12", "w-2/3"],
          ["w-16", "w-1/3"],
          ["w-28", "w-1/2"],
        ].map(([labelWidth, valueWidth]) => (
          <div key={labelWidth}>
            <Label width={labelWidth} />
            {/* An outlined input with its value, like the real field */}
            <div className="border-border-subtle rounded-field flex h-[49px] items-center border px-4">
              <div className={`${bar} rounded-chip h-4 ${valueWidth}`} />
            </div>
          </div>
        ))}

        {/* Markdown editor */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label width="w-20" />
            <div className={`${bar} rounded-chip h-3 w-16`} />
          </div>
          <div className="border-border-subtle rounded-field border">
            <div className="border-border-subtle bg-surface-raised rounded-t-field flex flex-wrap items-center gap-1 border-b p-2">
              {[...Array(12)].map((_, index) => (
                <div key={index} className={`${bar} rounded-control h-8 w-8`} />
              ))}
            </div>
            <div className="h-[396px] space-y-3 p-4">
              {["w-full", "w-11/12", "w-full", "w-3/4", "w-5/6", "w-2/3"].map(
                (width, index) => (
                  <div
                    key={index}
                    className={`${bar} rounded-chip h-3 ${width}`}
                  />
                ),
              )}
            </div>
          </div>
          <div className={`${bar} rounded-chip mt-2 h-3 w-48`} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className={`${bar} rounded-field h-11 w-40`} />
          <div className={`${bar} rounded-field h-11 w-36`} />
        </div>
      </div>
    </div>
  );
};

export default BlogFormSkeleton;
