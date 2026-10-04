// Server-only module (reads GITHUB_TOKEN) — import it from Server Components.
//
// Public GitHub stats for the homepage's GitHub section.
//
// GraphQL is the primary source because it's the only API that exposes the
// contribution calendar — but GitHub requires a token for GraphQL even when
// reading public data. GITHUB_TOKEN is a fine-grained PAT with *no*
// permissions (public read only). Without it (or if it's expired), we fall
// back to the unauthenticated REST API and simply render without the heatmap.
//
// Both paths use `fetch` with `next.revalidate`, so GitHub is hit at most
// once an hour regardless of traffic (well inside the 60 req/hr anonymous
// limit), and the "GitHubData" tag lets the existing
// /api/revalidate/revalidatetag endpoint bust it on demand.

const GITHUB_LOGIN = "Geoffrey-Owuor";
const REVALIDATE_SECONDS = 3600;
const CACHE_OPTIONS = {
  next: { revalidate: REVALIDATE_SECONDS, tags: ["GitHubData"] },
};

const RECENT_REPOS_LIMIT = 4;
const LANGUAGES_LIMIT = 5;

// Colours for the REST fallback, which (unlike GraphQL) doesn't return them.
// Mirrors GitHub's linguist colours for the languages that actually appear.
const FALLBACK_LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  PHP: "#4F5D95",
  Rust: "#dea584",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#663399",
};

const PROFILE_QUERY = `
  query ($login: String!) {
    user(login: $login) {
      name
      login
      bio
      url
      isHireable
      createdAt
      followers { totalCount }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        privacy: PUBLIC
        isFork: false
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes {
          name
          description
          url
          pushedAt
          stargazerCount
          forkCount
          primaryLanguage { name color }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges { size node { name color } }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }
`;

// --- Derivations --------------------------------------------------------

// The profile-README repo (named after the login) holds no code, so it would
// only add noise to the language split and the "recently active" list.
const isCodeRepo = (repo, login) =>
  repo.name.toLowerCase() !== login.toLowerCase();

// Sum language bytes across repos and return the top N as percentages, with
// everything beyond that folded into "Other".
const summarizeLanguages = (byteTotals) => {
  const entries = Object.values(byteTotals).sort((a, b) => b.bytes - a.bytes);
  const total = entries.reduce((sum, l) => sum + l.bytes, 0);
  if (total === 0) return [];

  const top = entries.slice(0, LANGUAGES_LIMIT);
  const restBytes = entries
    .slice(LANGUAGES_LIMIT)
    .reduce((sum, l) => sum + l.bytes, 0);
  if (restBytes > 0) top.push({ name: "Other", color: null, bytes: restBytes });

  return top.map(({ name, color, bytes }) => ({
    name,
    color,
    percent: (bytes / total) * 100,
  }));
};

// Current streak counts back from today, but a quiet *today* doesn't break it
// (the day isn't over yet), so it starts from yesterday in that case.
// `activeDays` is shown in place of the current streak when that's 0.
const computeStreaks = (days) => {
  let longest = 0;
  let run = 0;
  let activeDays = 0;
  for (const day of days) {
    if (day.count > 0) activeDays++;
    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }

  let current = 0;
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  for (; i >= 0 && days[i].count > 0; i--) current++;

  return { current, longest, activeDays };
};

const toRecentRepo = (repo) => ({
  name: repo.name,
  description: repo.description,
  url: repo.url,
  pushedAt: repo.pushedAt,
  stars: repo.stars,
  forks: repo.forks,
  language: repo.language,
});

// --- Sources ------------------------------------------------------------

const fetchFromGraphQL = async (token) => {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: PROFILE_QUERY,
      variables: { login: GITHUB_LOGIN },
    }),
    ...CACHE_OPTIONS,
  });

  if (!res.ok) throw new Error(`GitHub GraphQL responded ${res.status}`);
  const { data, errors } = await res.json();
  if (errors?.length || !data?.user) {
    throw new Error(errors?.[0]?.message ?? "GitHub user not found");
  }

  const { user } = data;
  const repos = user.repositories.nodes.filter((r) =>
    isCodeRepo(r, user.login),
  );

  const byteTotals = {};
  for (const repo of repos) {
    for (const { size, node } of repo.languages.edges) {
      byteTotals[node.name] ??= {
        name: node.name,
        color: node.color,
        bytes: 0,
      };
      byteTotals[node.name].bytes += size;
    }
  }

  const calendar = user.contributionsCollection.contributionCalendar;
  const days = calendar.weeks.flatMap((w) =>
    w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
    })),
  );

  return {
    profile: {
      name: user.name,
      login: user.login,
      bio: user.bio?.trim() || null,
      url: user.url,
      isHireable: user.isHireable,
      createdAt: user.createdAt,
      followers: user.followers.totalCount,
      publicRepos: repos.length,
      totalStars: repos.reduce((sum, r) => sum + r.stargazerCount, 0),
    },
    languages: summarizeLanguages(byteTotals),
    recentRepos: repos.slice(0, RECENT_REPOS_LIMIT).map((r) =>
      toRecentRepo({
        ...r,
        stars: r.stargazerCount,
        forks: r.forkCount,
        language: r.primaryLanguage,
      }),
    ),
    contributions: {
      total: calendar.totalContributions,
      ...computeStreaks(days),
      weeks: calendar.weeks.map((w) =>
        w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
        })),
      ),
    },
  };
};

const fetchFromREST = async () => {
  const headers = { Accept: "application/vnd.github+json" };
  const base = `https://api.github.com/users/${GITHUB_LOGIN}`;

  const [userRes, reposRes] = await Promise.all([
    fetch(base, { headers, ...CACHE_OPTIONS }),
    fetch(`${base}/repos?per_page=100&sort=pushed&type=owner`, {
      headers,
      ...CACHE_OPTIONS,
    }),
  ]);
  if (!userRes.ok || !reposRes.ok) {
    throw new Error(
      `GitHub REST responded ${userRes.status}/${reposRes.status}`,
    );
  }

  const user = await userRes.json();
  const repos = (await reposRes.json()).filter(
    (r) => !r.fork && isCodeRepo(r, user.login),
  );

  // One request per repo for byte-accurate language totals — fine at a
  // dozen repos and an hourly cache, and it keeps the split comparable to
  // the GraphQL path.
  const languageMaps = await Promise.all(
    repos.map((r) =>
      fetch(r.languages_url, { headers, ...CACHE_OPTIONS })
        .then((res) => (res.ok ? res.json() : {}))
        .catch(() => ({})),
    ),
  );
  const byteTotals = {};
  for (const map of languageMaps) {
    for (const [name, bytes] of Object.entries(map)) {
      byteTotals[name] ??= {
        name,
        color: FALLBACK_LANGUAGE_COLORS[name] ?? null,
        bytes: 0,
      };
      byteTotals[name].bytes += bytes;
    }
  }

  return {
    profile: {
      name: user.name,
      login: user.login,
      bio: user.bio?.trim() || null,
      url: user.html_url,
      isHireable: Boolean(user.hireable),
      createdAt: user.created_at,
      followers: user.followers,
      publicRepos: repos.length,
      totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
    },
    languages: summarizeLanguages(byteTotals),
    recentRepos: repos.slice(0, RECENT_REPOS_LIMIT).map((r) =>
      toRecentRepo({
        name: r.name,
        description: r.description,
        url: r.html_url,
        pushedAt: r.pushed_at,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language
          ? {
              name: r.language,
              color: FALLBACK_LANGUAGE_COLORS[r.language] ?? null,
            }
          : null,
      }),
    ),
    contributions: null,
  };
};

// Returns `null` only if every source failed; callers render a static
// fallback card in that case rather than breaking the homepage.
export const getGitHubData = async () => {
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    try {
      return await fetchFromGraphQL(token);
    } catch (error) {
      console.error(
        "GitHub GraphQL fetch failed, falling back to REST:",
        error,
      );
    }
  }

  try {
    return await fetchFromREST();
  } catch (error) {
    console.error("Failed to fetch GitHub data:", error);
    return null;
  }
};
