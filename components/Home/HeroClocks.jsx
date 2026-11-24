"use client";

import { useEffect, useState } from "react";

const HOME_ZONE = "Africa/Nairobi";

// Minutes east of UTC that `timeZone` is at `date`.
const offsetMinutes = (timeZone, date) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, Number(value)]),
  );
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
  );
  // The parts stop at minutes, so compare against the minute too.
  const minute = date.getTime() - (date.getTime() % 60000);
  return Math.round((asUtc - minute) / 60000);
};

// 180 → "UTC+3", -330 → "UTC−5:30", 0 → "UTC".
const formatUtc = (minutes) => {
  if (minutes === 0) return "UTC";
  const abs = Math.abs(minutes);
  const m = abs % 60;
  return `UTC${minutes > 0 ? "+" : "−"}${Math.floor(abs / 60)}${m ? `:${String(m).padStart(2, "0")}` : ""}`;
};

// 180 → "3h", 150 → "2h 30m".
const formatSpan = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h && `${h}h`, m && `${m}m`].filter(Boolean).join(" ");
};

// The zone's own abbreviation ("EST", "CET") when the browser has one, so
// it isn't just the UTC offset again ("GMT+3").
const zoneAbbreviation = (timeZone, date) => {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;
  return name && /^[A-Z]{2,5}$/.test(name) && !/^(UTC|GMT)$/.test(name)
    ? name
    : null;
};

// "America/Argentina/Buenos_Aires" → "Buenos Aires". Zones are named after a
// major city, which isn't always the visitor's own.
const cityFromZone = (timeZone) => {
  const city = timeZone.split("/").pop()?.replaceAll("_", " ");
  return city && timeZone.includes("/") ? city : null;
};

// Working hours, Nairobi time: Mon–Fri, 8 AM to 5 PM.
const WORK_START = 8;
const WORK_END = 17;
const WORK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// An hour of the day in the visitor's own clock style ("8:00 AM", "08:00").
const formatHour = (hour, options = { minute: "2-digit" }) =>
  new Intl.DateTimeFormat(undefined, {
    timeZone: "UTC",
    hour: "numeric",
    ...options,
  }).format(Date.UTC(2000, 0, 1, hour));

// "8 AM – 5 PM", or "08–17" where the day runs on a 24-hour clock.
const workingHoursRange = () => {
  const format = new Intl.DateTimeFormat(undefined, {
    timeZone: "UTC",
    hour: "numeric",
  });
  const start = Date.UTC(2000, 0, 1, WORK_START);
  const end = Date.UTC(2000, 0, 1, WORK_END);
  return format.formatRange
    ? format.formatRange(start, end)
    : `${format.format(start)} – ${format.format(end)}`;
};

// Whether I'm in working hours, and when that next changes.
const availability = (date) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: HOME_ZONE,
      weekday: "short",
      hour: "numeric",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, value]),
  );
  const hour = Number(parts.hour);
  const workday = WORK_DAYS.includes(parts.weekday);
  const back = formatHour(WORK_START);

  if (workday && hour >= WORK_START && hour < WORK_END) {
    return { open: true, note: `until ${formatHour(WORK_END)}` };
  }
  if (workday && hour < WORK_START) {
    return { open: false, note: `back at ${back}` };
  }
  // The next workday, short so the note stays on one line on most phones.
  const next = { Mon: "Tue", Tue: "Wed", Wed: "Thu", Thu: "Fri" };
  return {
    open: false,
    note: `back ${next[parts.weekday] ?? "Mon"}, ${back}`,
  };
};

// One line's content, or a pulsing bar in its place until mount. Content that
// replaces a bar fades in; content the server already had (the home label)
// is left alone, so it doesn't fade on first paint.
const Slot = ({ value, bar, className = "" }) => {
  const [arrives] = useState(value == null);
  return value == null ? (
    <span
      key="bar"
      aria-hidden="true"
      className={`bg-border-subtle rounded-chip block animate-pulse ${bar}`}
    />
  ) : (
    <span
      key="value"
      className={`${arrives ? "animate-hero-settle" : ""} ${className}`}
    >
      {value}
    </span>
  );
};

// One card. Every line keeps its height before mount, when it shows a
// skeleton bar, so nothing shifts when the content lands; long lines wrap (on
// the narrowest phones) and the row stretches both cards to match.
const Card = ({ label, main, caption, note, className }) => (
  <li
    className={`border-border-subtle bg-surface-raised rounded-card min-w-0 border px-3 py-3 sm:px-4 ${className}`}
  >
    <p className="text-text-muted min-h-4 font-mono text-xs">
      <Slot value={label} bar="my-0.5 h-3 w-24" />
    </p>
    <p className="text-text-primary mt-1 flex h-7 items-center text-xl font-semibold tabular-nums">
      <Slot value={main} bar="h-5 w-20" className="flex items-center gap-2" />
    </p>
    <p className="text-text-muted mt-0.5 min-h-4 text-xs">
      <Slot value={caption} bar="my-0.5 h-3 w-28" />
    </p>
    <p className="text-accent mt-1 min-h-4 font-mono text-xs">
      <Slot value={note} bar="my-0.5 h-3 w-24" />
    </p>
  </li>
);

const Time = ({ date, timeZone }) => (
  <time dateTime={date.toISOString()}>
    {new Intl.DateTimeFormat(undefined, {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
    }).format(date)}
  </time>
);

/**
 * Two cards, always: my local time, then the visitor's when their clock
 * reads differently (compared by UTC offset, not zone name, so Kampala counts
 * as the same), or my working hours when it doesn't. Content is client-only:
 * the server can't know the visitor's zone, and a clock rendered there would
 * mismatch on hydration. Until mount both cards are frames of their final
 * size with skeleton bars in place of what depends on the time zone. They
 * tick on the minute.
 */
const HeroClocks = () => {
  const [now, setNow] = useState(null);
  const [visitorZone, setVisitorZone] = useState(null);

  useEffect(() => {
    setVisitorZone(Intl.DateTimeFormat().resolvedOptions().timeZone ?? null);

    let timer;
    const tick = () => {
      const date = new Date();
      setNow(date);
      timer = setTimeout(tick, 60000 - (date.getTime() % 60000) + 50);
    };
    tick();
    // Timers are throttled in background tabs; catch up on return.
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      clearTimeout(timer);
      tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const homeOffset = now ? offsetMinutes(HOME_ZONE, now) : 0;
  const visitorOffset =
    now && visitorZone ? offsetMinutes(visitorZone, now) : homeOffset;
  const diff = homeOffset - visitorOffset;
  const showVisitor = Boolean(now && visitorZone && diff !== 0);

  let second = {};
  if (showVisitor) {
    const city = cityFromZone(visitorZone);
    second = {
      label: city ?? visitorZone,
      main: <Time date={now} timeZone={visitorZone} />,
      caption: [zoneAbbreviation(visitorZone, now), formatUtc(visitorOffset)]
        .filter(Boolean)
        .join(" · "),
      note: "your time",
    };
  } else if (now) {
    const { open, note } = availability(now);
    second = {
      label: "Working hours",
      main: (
        <>
          <span
            aria-hidden="true"
            className={`h-2 w-2 shrink-0 rounded-full ${open ? "bg-success" : "bg-text-muted"}`}
          />
          {open ? "Available" : "Away"}
        </>
      ),
      caption: (
        <>
          Mon–Fri ·{" "}
          <span className="whitespace-nowrap">{workingHoursRange()}</span>
        </>
      ),
      note,
    };
  }

  return (
    <ul
      aria-label="Local time and availability"
      aria-busy={!now}
      className="grid max-w-md grid-cols-2 gap-3 lg:flex lg:max-w-none"
    >
      <Card
        label="Nairobi, Kenya"
        main={now && <Time date={now} timeZone={HOME_ZONE} />}
        caption={now && `EAT · ${formatUtc(homeOffset)}`}
        note={
          now &&
          (showVisitor
            ? `${formatSpan(Math.abs(diff))} ${diff > 0 ? "ahead of" : "behind"} you`
            : "same time as you")
        }
        className="motion-safe:animate-hero-rise [--hero-delay:200ms] lg:w-48"
      />
      <Card
        {...second}
        className="motion-safe:animate-hero-rise [--hero-delay:260ms] lg:w-48"
      />
    </ul>
  );
};

export default HeroClocks;
