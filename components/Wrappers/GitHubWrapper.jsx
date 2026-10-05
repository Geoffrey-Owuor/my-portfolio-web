"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookMarked,
  CalendarCheck,
  CalendarDays,
  Flame,
  GitCommitHorizontal,
  GitFork,
  Star,
  Trophy,
  UsersRound,
} from "lucide-react";
import { assets } from "@/assets/assets";
import SectionTitle from "./SectionTitle";

const GITHUB_URL = "https://github.com/Geoffrey-Owuor";

const cardClass = "bg-surface border-border-subtle rounded-xl border p-6";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, delay },
});

const numberFormat = new Intl.NumberFormat("en");
const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const timeAgo = (iso) => {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const steps = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) {
      return relativeFormat.format(Math.round(seconds / size), unit);
    }
  }
  return "just now";
};

const LanguageDot = ({ color }) => (
  <span
    className="bg-text-muted h-2.5 w-2.5 shrink-0 rounded-full"
    style={color ? { backgroundColor: color } : undefined}
  />
);

// --- Identity -----------------------------------------------------------

const ProfileCard = ({ profile }) => {
  const memberSince = new Date(profile.createdAt).getUTCFullYear();
  const meta = [
    { icon: BookMarked, label: "repos", value: profile.publicRepos },
    { icon: Star, label: "stars", value: profile.totalStars },
    { icon: UsersRound, label: "followers", value: profile.followers },
  ];

  return (
    <div className={`${cardClass} flex flex-col items-center text-center`}>
      <Image
        src={assets.github_avatar}
        alt={`${profile.name ?? profile.login}'s GitHub avatar`}
        width={112}
        height={112}
        sizes="112px"
        className="border-border-subtle h-28 w-28 rounded-full border object-cover"
      />
      <h3 className="text-text-primary mt-4 text-lg font-semibold">
        {profile.name ?? profile.login}
      </h3>
      <p className="text-text-muted font-mono text-sm">@{profile.login}</p>

      {profile.isHireable && (
        <span className="bg-success/10 text-success mt-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs">
          <span className="bg-success h-1.5 w-1.5 rounded-full" />
          Open to work
        </span>
      )}

      {profile.bio && (
        <p className="text-text-muted mt-3 text-sm leading-relaxed">
          {profile.bio}
        </p>
      )}

      <div className="text-text-muted mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
        {meta.map(({ icon: Icon, label, value }) => (
          <span key={label} className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">
              {numberFormat.format(value)}
            </span>
            {label}
          </span>
        ))}
      </div>
      <p className="text-text-muted mt-2 flex items-center gap-1.5 text-xs">
        <CalendarDays className="h-3.5 w-3.5" />
        On GitHub since {memberSince}
      </p>

      <a
        href={profile.url}
        target="_blank"
        rel="noopener noreferrer"
        className="border-border-subtle hover:border-accent hover:text-accent text-text-primary mt-5 flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm transition-colors duration-150"
      >
        View on GitHub
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
};

// Rendered only if every GitHub source failed — keeps the section (and the
// link out) intact instead of leaving a hole in the homepage.
const FallbackCard = () => (
  <div
    className={`${cardClass} mx-auto flex max-w-md flex-col items-center text-center`}
  >
    <Image
      src={assets.github_avatar}
      alt="GitHub avatar"
      width={96}
      height={96}
      sizes="96px"
      className="border-border-subtle h-24 w-24 rounded-full border object-cover"
    />
    <p className="text-text-primary mt-4 font-mono text-sm">@Geoffrey-Owuor</p>
    <p className="text-text-muted mt-2 text-sm">
      Live GitHub stats are unavailable right now.
    </p>
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="border-border-subtle hover:border-accent hover:text-accent text-text-primary mt-5 flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm transition-colors duration-150"
    >
      View on GitHub
      <ArrowUpRight className="h-4 w-4" />
    </a>
  </div>
);

// --- Contributions ------------------------------------------------------

const LEVEL_CLASSES = [
  "bg-border-subtle",
  "bg-accent/25",
  "bg-accent/50",
  "bg-accent/75",
  "bg-accent",
];

// Scaled against the busiest day rather than fixed buckets, so a quiet year
// still shows texture instead of a uniform pale wash.
const levelFor = (count, max) => {
  if (count === 0 || max === 0) return 0;
  return Math.min(4, Math.ceil((count / max) * 4));
};

const formatDay = (date) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

const ContributionsCard = ({ contributions }) => {
  const scrollRef = useRef(null);
  const { weeks } = contributions;

  // Narrow screens can't fit 53 columns — park the scroller on the most
  // recent weeks, which are the ones worth seeing first.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const max = Math.max(0, ...weeks.flat().map((d) => d.count));

  // GitHub weeks run Sunday→Saturday, and the first one is usually partial;
  // pad it so every day lands in its weekday row.
  const firstWeekday = new Date(`${weeks[0][0].date}T00:00:00Z`).getUTCDay();

  // A month label sits over the first column whose week starts in a new
  // month. The opening column is usually a stub of the previous month, so
  // its label is dropped when it would overlap the next one.
  const monthOf = (week) => new Date(`${week[0].date}T00:00:00Z`).getUTCMonth();
  const monthLabels = weeks.flatMap((week, col) =>
    col > 0 && monthOf(week) === monthOf(weeks[col - 1])
      ? []
      : [
          {
            col,
            label: new Date(Date.UTC(2000, monthOf(week), 1)).toLocaleString(
              "en",
              { month: "short", timeZone: "UTC" },
            ),
          },
        ],
  );
  if (monthLabels.length > 1 && monthLabels[1].col - monthLabels[0].col < 3) {
    monthLabels.shift();
  }

  const days = (n) => (n === 1 ? "day" : "days");
  const stats = [
    {
      icon: GitCommitHorizontal,
      label: "Contributions",
      value: numberFormat.format(contributions.total),
    },
    // A broken streak reads as a negative on a portfolio, so a 0 swaps the
    // tile for how many days of the year saw any activity at all.
    contributions.current > 0
      ? {
          icon: Flame,
          label: "Current streak",
          value: contributions.current,
          unit: days(contributions.current),
        }
      : {
          icon: CalendarCheck,
          label: "Active days",
          value: contributions.activeDays,
          unit: days(contributions.activeDays),
        },
    {
      icon: Trophy,
      label: "Longest streak",
      value: contributions.longest,
      unit: days(contributions.longest),
    },
  ];

  const columns = { gridTemplateColumns: `repeat(${weeks.length}, 10px)` };

  return (
    <div className={`${cardClass} min-w-0`}>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {stats.map(({ icon: Icon, label, value, unit }) => (
          <div
            key={label}
            className="bg-surface-raised flex min-w-0 flex-col gap-1 rounded-lg px-3 py-3 sm:px-4"
          >
            <span className="text-text-muted flex items-center gap-1.5 text-[11px] sm:text-xs">
              <Icon className="text-accent hidden h-3.5 w-3.5 shrink-0 sm:block" />
              {label}
            </span>
            <span className="text-text-primary font-mono text-lg font-semibold whitespace-nowrap sm:text-2xl">
              {value}
              {unit && (
                <span className="text-text-muted ml-1 text-xs font-normal sm:text-sm">
                  {unit}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      <div ref={scrollRef} className="mt-6 overflow-x-auto pb-2">
        <div className="mx-auto w-max">
          <div
            className="text-text-muted mb-1.5 grid gap-[3px] text-[10px]"
            style={columns}
          >
            {monthLabels.map(({ col, label }) => (
              <span
                key={col}
                className="whitespace-nowrap"
                style={{ gridColumnStart: col + 1 }}
              >
                {label}
              </span>
            ))}
          </div>
          <div
            role="img"
            aria-label={`${contributions.total} contributions in the past year`}
            className="grid grid-flow-col grid-rows-7 gap-[3px]"
            style={columns}
          >
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <span key={`pad-${i}`} />
            ))}
            {weeks.flat().map(({ date, count }) => (
              <span
                key={date}
                title={`${count} ${count === 1 ? "contribution" : "contributions"} on ${formatDay(date)}`}
                className={`h-2.5 w-2.5 rounded-xs ${LEVEL_CLASSES[levelFor(count, max)]}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-text-muted mt-3 flex items-center gap-1.5 text-[11px]">
        <span className="mr-auto">Past 12 months</span>
        Less
        {LEVEL_CLASSES.map((cls) => (
          <span key={cls} className={`h-2.5 w-2.5 rounded-xs ${cls}`} />
        ))}
        More
      </div>
    </div>
  );
};

// --- Languages ----------------------------------------------------------

const LanguagesCard = ({ languages }) => (
  <div className={cardClass}>
    <h3 className="text-text-muted mb-4 font-mono text-xs font-semibold tracking-wide uppercase">
      Most used languages
    </h3>
    <div className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full">
      {languages.map(({ name, color, percent }) => (
        <span
          key={name}
          className="bg-text-muted h-full"
          style={{
            width: `${percent}%`,
            ...(color ? { backgroundColor: color } : {}),
          }}
        />
      ))}
    </div>
    <ul className="mt-4 flex flex-col gap-2">
      {languages.map(({ name, color, percent }) => (
        <li key={name} className="flex items-center gap-2 text-sm">
          <LanguageDot color={color} />
          <span className="text-text-primary">{name}</span>
          <span className="text-text-muted ml-auto font-mono text-xs">
            {percent < 0.1 ? "<0.1" : percent.toFixed(1)}%
          </span>
        </li>
      ))}
    </ul>
  </div>
);

// --- Recent repos -------------------------------------------------------

const RecentReposCard = ({ repos }) => (
  <div className={cardClass}>
    <h3 className="text-text-muted mb-4 font-mono text-xs font-semibold tracking-wide uppercase">
      Recently active
    </h3>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {repos.map((repo) => (
        <a
          key={repo.name}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group border-border-subtle hover:border-accent focus-visible:border-accent flex flex-col rounded-lg border p-4 transition-colors duration-150 focus-visible:outline-none"
        >
          <span className="flex items-start justify-between gap-2">
            <span className="text-text-primary truncate font-mono text-sm font-semibold">
              {repo.name}
            </span>
            <ArrowUpRight className="text-text-muted group-hover:text-accent h-4 w-4 shrink-0 transition-colors" />
          </span>
          <span className="text-text-muted mt-1.5 line-clamp-2 flex-1 text-sm">
            {repo.description ?? "No description provided."}
          </span>
          <span className="text-text-muted mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <LanguageDot color={repo.language.color} />
                {repo.language.name}
              </span>
            )}
            {repo.stars > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {repo.stars}
              </span>
            )}
            {repo.forks > 0 && (
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3" />
                {repo.forks}
              </span>
            )}
            {/* Relative to "now", so server and client can disagree by a
                tick at a unit boundary — harmless, so silence the warning. */}
            <span suppressHydrationWarning>
              Updated {timeAgo(repo.pushedAt)}
            </span>
          </span>
        </a>
      ))}
    </div>
  </div>
);

// --- Section ------------------------------------------------------------

const GitHubWrapper = ({ data }) => {
  return (
    <div className="mx-1 w-full min-w-0 flex-1 md:mx-auto">
      <SectionTitle
        label="Code in the open"
        title="GitHub Activity"
        alertMessage="Shipping consistently, one commit at a time"
        alertIcon={GitCommitHorizontal}
      />

      {!data && (
        <motion.div {...fadeUp()}>
          <FallbackCard />
        </motion.div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-6">
            <motion.div {...fadeUp()}>
              <ProfileCard profile={data.profile} />
            </motion.div>
            {data.languages.length > 0 && (
              <motion.div {...fadeUp(0.1)}>
                <LanguagesCard languages={data.languages} />
              </motion.div>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
            {data.contributions && (
              <motion.div {...fadeUp(0.15)}>
                <ContributionsCard contributions={data.contributions} />
              </motion.div>
            )}
            {data.recentRepos.length > 0 && (
              <motion.div {...fadeUp(0.2)}>
                <RecentReposCard repos={data.recentRepos} />
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubWrapper;
