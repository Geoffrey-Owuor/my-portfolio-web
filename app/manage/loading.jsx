import { PageHeaderSkeleton } from "@/components/Layout/PageHeader";

// Shown while /manage renders on the server (it reads every list fresh), in
// ManageShell's layout: header with the account menu, the tab bar with
// Refresh site, and a generic list, since the tab isn't known here. Tab
// switches use pushState, so this only appears when navigating to the page.
const bar = "bg-border-subtle animate-pulse";
// The real tabs' widths, in order.
const TAB_WIDTHS = [
  "w-22",
  "w-27",
  "w-25",
  "w-17",
  "w-18",
  "w-17",
  "w-22",
  "w-17",
];

const ManageLoading = () => {
  return (
    <div
      className="container-page py-section"
      role="status"
      aria-label="Loading the manage page"
    >
      <div className="relative">
        <PageHeaderSkeleton
          title="Manage portfolio"
          subtitle="Everything visitors see, in one place"
          className="mb-0! pr-20"
        />
        {/* Account menu */}
        <div
          className={`${bar} rounded-control absolute top-0 right-0 h-10 w-16`}
          aria-hidden="true"
        />
      </div>

      <div aria-hidden="true">
        {/* Tabs + Refresh site */}
        <div className="rule-rails mb-8 flex items-center gap-3 py-3">
          <div className="flex min-w-0 flex-1 gap-1 overflow-hidden">
            {TAB_WIDTHS.map((width, index) => (
              <div
                key={index}
                className={`${bar} rounded-control h-9 shrink-0 ${width}`}
              />
            ))}
          </div>
          {/* Icon-only below sm, like RefreshSiteMenu */}
          <div
            className={`${bar} rounded-control h-[37px] w-[70px] shrink-0 sm:w-40`}
          />
        </div>

        {/* List heading + add button */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className={`${bar} rounded-chip h-6 w-40`} />
          <div className={`${bar} rounded-control h-10 w-44`} />
        </div>

        {/* Rows */}
        <ul className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <li
              key={index}
              className="border-border-subtle bg-surface rounded-card flex flex-col gap-2 border p-4 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="flex h-5 min-w-0 items-center sm:flex-1">
                <div
                  className={`${bar} rounded-chip h-4 ${index % 2 ? "w-40" : "w-56"} max-w-full`}
                />
              </div>
              <div className="flex shrink-0 items-center justify-end gap-1">
                {[...Array(4)].map((_, button) => (
                  <div
                    key={button}
                    className={`${bar} rounded-control h-9 w-9`}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageLoading;
