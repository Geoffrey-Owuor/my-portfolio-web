// Stands in for the /manage Inbox list on first load: message cards shaped
// like the real ones (sender, date, two icon buttons, body). Each bar sits in
// a box the height of the line it replaces, so the cards don't jump when the
// messages arrive. No pager: Pagination hides itself for a single page, and
// most inboxes are one page.
const bar = "bg-border-subtle rounded-chip animate-pulse";

const InboxSkeleton = () => {
  return (
    <ul
      className="space-y-2"
      role="status"
      aria-label="Loading messages"
      aria-busy="true"
    >
      {[...Array(3)].map((_, index) => (
        <li
          key={index}
          aria-hidden="true"
          className="border-border-subtle bg-surface rounded-card border p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {/* Sender (text-sm line) */}
              <div className="flex h-5 items-center">
                <div
                  className={`${bar} h-3.5 max-w-full ${index % 2 ? "w-40" : "w-56"}`}
                />
              </div>
              {/* Date (text-xs line) */}
              <div className="mt-1 flex h-4 items-center">
                <div className={`${bar} h-3 w-28`} />
              </div>
            </div>

            {/* Read toggle + delete */}
            <div className="flex shrink-0 items-center gap-1">
              <div className={`${bar} rounded-control h-9 w-9`} />
              <div className={`${bar} rounded-control h-9 w-9`} />
            </div>
          </div>

          {/* Message body (text-sm line) */}
          <div className="mt-3 flex h-5 items-center">
            <div className={`${bar} h-3.5 ${index % 2 ? "w-1/2" : "w-3/4"}`} />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default InboxSkeleton;
