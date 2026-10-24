// Header for a standalone route page (/blogs, /createblog, 404 …): the
// page's `~/path`, an h1 on the shared `text-h1` step, an optional one-line
// subtitle, and a hairline — the route-level counterpart of the homepage's
// SectionTitle, without its scroll-linked motion so it can render on the
// server.
const PageHeader = ({ path, title, subtitle, className = "" }) => (
  <header className={`border-border-subtle mb-8 border-b pb-6 ${className}`}>
    <p className="text-accent font-mono text-xs">~/{path}</p>
    <h1 className="text-text-primary text-h1 mt-2 font-semibold">{title}</h1>
    {subtitle && <p className="text-text-muted mt-2 text-base">{subtitle}</p>}
  </header>
);

// Same footprint, for route skeletons.
export const PageHeaderSkeleton = () => (
  <div className="border-border-subtle mb-8 border-b pb-6" aria-hidden="true">
    <div className="bg-border-subtle h-3 w-16 animate-pulse rounded-md" />
    <div className="bg-border-subtle mt-3 h-9 w-56 animate-pulse rounded-md" />
    <div className="bg-border-subtle mt-3 h-4 w-72 max-w-full animate-pulse rounded-md" />
  </div>
);

export default PageHeader;
