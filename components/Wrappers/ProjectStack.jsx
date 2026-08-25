const ProjectStack = ({ projectStack, limit }) => {
  // Turn the stack string into an array
  const stackArray = projectStack.split(",").map((s) => s.trim());
  const visibleStack = limit ? stackArray.slice(0, limit) : stackArray;
  const remaining = limit ? stackArray.length - visibleStack.length : 0;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visibleStack.map((stack, index) => (
        <div
          key={index}
          className="font-mono bg-accent/10 text-accent rounded-full px-2.5 py-0.5 text-sm text-nowrap"
        >
          {stack}
        </div>
      ))}
      {remaining > 0 && (
        <div className="font-mono text-text-muted border-border-subtle rounded-full border px-2.5 py-0.5 text-sm text-nowrap">
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default ProjectStack;
