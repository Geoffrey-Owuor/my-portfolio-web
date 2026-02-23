const ProjectStack = ({ projectStack }) => {
  // Turn the tack string into an array
  const stackArray = projectStack.split(",");
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {stackArray.map((stack, index) => (
        <div
          key={index}
          className="font-roboto-mono rounded-full bg-blue-100 px-3 py-1 text-sm text-nowrap text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        >
          {stack}
        </div>
      ))}
    </div>
  );
};

export default ProjectStack;
