const SectionTitle = ({ label, title }) => {
  return (
    <div className="mb-16 flex flex-col items-center justify-center gap-3">
      <span className="font-dm-mono text-sm font-medium tracking-[0.2em] text-gray-400 uppercase dark:text-gray-500">
        {label}
      </span>
      <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl dark:text-white">
        {title}
      </h2>
      <div className="mt-1 h-px w-12 bg-gray-300 dark:bg-gray-700" />
    </div>
  );
};

export default SectionTitle;
