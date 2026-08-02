const ProjectStack = ({ projectStack }) => {
  // Turn the tack string into an array
  const stackArray = projectStack.split(",");
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {stackArray.map((stack, index) => (
        <div
          key={index}
          className="font-dm-mono bg-accent/10 text-accent rounded-full px-3 py-1 text-sm text-nowrap"
        >
          {stack}
        </div>
      ))}
    </div>
  );
};

export default ProjectStack;
