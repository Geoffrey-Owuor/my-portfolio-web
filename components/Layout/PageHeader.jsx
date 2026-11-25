// Header for a standalone route page (/blogs, /manage, 404 …): the
// page's `~/path`, an h1 on the shared `text-h1` step, an optional one-line
// subtitle, and a hairline — the route-level counterpart of the homepage's
// SectionTitle, without its scroll-linked motion so it can render on the
// server.
const PageHeader = ({ path, title, subtitle, className = "" }) => (
  <header className={`rule-rails mb-8 pb-6 ${className}`}>
    <p className="text-accent font-mono text-xs">~/{path}</p>
    <h1 className="text-text-primary text-h1 mt-2 font-semibold">{title}</h1>
    {subtitle && <p className="text-text-muted mt-2 text-base">{subtitle}</p>}
  </header>
);

// Same footprint, for route skeletons. Each bar sits in a box the height of
// the line it stands for, so the rule below lands where the real header's
// does. Given the page's `title`/`subtitle`, it draws them as hidden text on
// a pulsing background instead, which wraps exactly like the real header at
// every width.
const pulse =
  "bg-border-subtle animate-pulse text-transparent box-decoration-clone";

export const PageHeaderSkeleton = ({ title, subtitle, className = "" }) => (
  <div className={`rule-rails mb-8 pb-6 ${className}`} aria-hidden="true">
    <div className="flex h-4 items-center">
      <div className="bg-border-subtle rounded-chip h-3 w-16 animate-pulse" />
    </div>
    {title ? (
      <p className="text-h1 mt-2 font-semibold">
        <span className={`${pulse} rounded-control`}>{title}</span>
      </p>
    ) : (
      <div className="text-h1 mt-2 flex h-[1.2em] items-center">
        <div className="bg-border-subtle rounded-control h-[0.8em] w-56 animate-pulse" />
      </div>
    )}
    {subtitle ? (
      <p className="mt-2 text-base">
        <span className={`${pulse} rounded-chip`}>{subtitle}</span>
      </p>
    ) : (
      <div className="mt-2 flex h-6 items-center">
        <div className="bg-border-subtle rounded-chip h-4 w-72 max-w-full animate-pulse" />
      </div>
    )}
  </div>
);

export default PageHeader;
