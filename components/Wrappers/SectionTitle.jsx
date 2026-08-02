const SectionTitle = ({ label, title }) => {
  return (
    <div className="mb-16 flex flex-col items-center justify-center gap-3">
      <span className="font-dm-mono text-text-muted text-sm font-medium tracking-[0.2em] uppercase">
        {label}
      </span>
      <h2 className="font-dm-mono text-text-primary text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      <div className="bg-accent mt-1 h-px w-12" />
    </div>
  );
};

export default SectionTitle;
