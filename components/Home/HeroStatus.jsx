import { getGitHubData } from "@/cache/GitHubData";

// Availability comes from the GitHub profile's "Available for hire" flag, so
// it's toggled from GitHub rather than a code change. Streamed in behind its
// own <Suspense> (see app/page.js) so the hero never waits on GitHub, and it
// renders nothing if GitHub is unreachable or the flag is off.
const HeroStatus = async () => {
  const data = await getGitHubData();
  if (!data?.profile?.isHireable) return null;

  return (
    <span className="text-success flex items-center gap-2 text-sm">
      <span className="relative flex h-2 w-2">
        <span className="bg-success absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping" />
        <span className="bg-success relative inline-flex h-2 w-2 rounded-full" />
      </span>
      Available for work
    </span>
  );
};

export default HeroStatus;
