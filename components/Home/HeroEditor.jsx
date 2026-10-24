"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Component,
  Database,
  FileCode2,
  LayoutTemplate,
  Rocket,
  Route,
  Server,
  SquareTerminal,
} from "lucide-react";

// The hero's "schema to polished UI" claim, shown rather than told: one tab
// per layer of this site's own blog feature, trimmed from the real files.
const TABS = [
  {
    id: "schema",
    label: "Schema",
    icon: Database,
    file: "db/schema.sql",
    lang: "sql",
    code: `-- Posts are owned by a user and cached by tag
CREATE TABLE blogs (
  id             SERIAL PRIMARY KEY,
  user_id        INT REFERENCES users(id),
  blog_title     TEXT NOT NULL,
  blog_author    TEXT NOT NULL,
  blog_content   TEXT NOT NULL,
  read_time      TEXT,
  blog_date      TIMESTAMPTZ DEFAULT now()
);`,
  },
  {
    id: "api",
    label: "API",
    icon: Server,
    file: "app/api/blogpost/route.js",
    lang: "js",
    code: `export async function POST(request) {
  const { title, content } = await request.json();

  // Verified in the handler, not just middleware
  const user = await verifyAccessTokenJWT();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" }, { status: 401 });
  }

  await query(blogQuery, [user.id, title, content]);
  return NextResponse.json({}, { status: 201 });
}`,
  },
  {
    id: "ui",
    label: "UI",
    icon: LayoutTemplate,
    file: "components/Home/Writing.jsx",
    lang: "js",
    code: `const Writing = async () => {
  const blogs = await BlogsData(); // cached by tag

  // Only a short excerpt crosses to the client
  const posts = blogs?.slice(0, 3).map((blog) => ({
    id: blog.id,
    title: blog.blog_title,
    excerpt: stripMarkdown(blog.blog_content, 180),
  }));

  return <WritingWrapper posts={posts ?? null} />;
};`,
  },
  {
    id: "ship",
    label: "Ship",
    icon: Rocket,
    file: "Terminal",
    lang: "shell",
    code: `$ npm run build
  ▲ Next.js 15.5
  ✓ Compiled successfully
  ✓ Linting and checking validity
  ✓ Generating static pages (24/24)

$ vercel --prod
  ✓ Deployed to jeff-portfolio-web.vercel.app
  ✓ Ready in 41s`,
  },
];

// The icon rail beside the code (VS Code-style): one file-type icon per tab,
// so it stays ~40px wide where a full file tree wouldn't fit.
const RAIL_ICONS = {
  schema: Database,
  api: Route,
  ui: Component,
  ship: SquareTerminal,
};

// A deliberately small highlighter: comments, strings, keywords, calls and
// numbers are all these snippets need, so no highlighting library ships.
const KEYWORDS = {
  sql: /\b(CREATE|TABLE|PRIMARY|KEY|REFERENCES|NOT|NULL|DEFAULT|SERIAL|INT|TEXT|TIMESTAMPTZ)\b/,
  js: /\b(export|async|function|const|await|if|return|new)\b/,
};
const highlight = (line, lang) => {
  if (lang === "shell") {
    if (line.startsWith("$"))
      return [
        ["text-accent", "$"],
        ["", line.slice(1)],
      ];
    if (line.includes("✓")) {
      const [before, after] = line.split("✓");
      return [
        ["", before],
        ["text-success", "✓"],
        ["text-text-muted", after],
      ];
    }
    return [["text-text-muted", line]];
  }

  const comment = lang === "sql" ? "--" : "//";
  const pattern = new RegExp(
    [
      `(${comment}.*$)`,
      `("[^"]*")`,
      `(${KEYWORDS[lang].source})`,
      `(\\b[A-Za-z_]\\w*(?=\\())`,
      `(\\b\\d+\\b)`,
    ].join("|"),
    "g",
  );
  const classes = [
    "text-code-comment italic",
    "text-code-string",
    "text-code-keyword",
    "text-code-function",
    "text-code-number",
  ];

  const tokens = [];
  let last = 0;
  for (const match of line.matchAll(pattern)) {
    if (match.index > last) tokens.push(["", line.slice(last, match.index)]);
    const group = match.slice(1).findIndex(Boolean);
    tokens.push([classes[group], match[0]]);
    last = match.index + match[0].length;
  }
  if (last < line.length) tokens.push(["", line.slice(last)]);
  return tokens;
};

/**
 * Editor-style card for the hero's right column: tabs across the top (one
 * per layer, schema → API → UI → ship), an icon rail, and the active file.
 * Tabs advance on their own — the progress bar under the active tab *is* the
 * timer (its animationend advances), so hovering or focusing the card pauses
 * it with plain CSS. Reduced motion: no bar, no cycling; tabs still click.
 */
const HeroEditor = () => {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const tab = TABS[active];

  const advance = () => setActive((i) => (i + 1) % TABS.length);

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onTabKeyDown = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (active + step + TABS.length) % TABS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="group border-border-subtle bg-surface-raised/60 rounded-card @container overflow-hidden border shadow-2xl shadow-black/5 backdrop-blur-sm dark:shadow-black/40">
      {/* Title bar: window dots + tabs */}
      <div className="border-border-subtle flex items-center gap-4 border-b px-4">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="bg-text-muted/40 h-2.5 w-2.5 rounded-full" />
          <span className="bg-text-muted/40 h-2.5 w-2.5 rounded-full" />
          <span className="bg-text-muted/40 h-2.5 w-2.5 rounded-full" />
        </div>
        <div
          role="tablist"
          aria-label="From schema to shipped"
          className="flex min-w-0 gap-1 overflow-x-auto py-2 [scrollbar-width:none]"
        >
          {TABS.map(({ id, label, icon: Icon }, i) => {
            const selected = i === active;
            return (
              <button
                key={id}
                ref={(el) => (tabRefs.current[i] = el)}
                id={`hero-tab-${id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="hero-tabpanel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onTabKeyDown}
                className={`rounded-control relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden px-3 py-1.5 text-sm font-medium transition-colors ${
                  selected
                    ? "bg-surface text-text-primary"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
                {selected && !prefersReducedMotion && (
                  <span
                    key={active}
                    aria-hidden="true"
                    onAnimationEnd={advance}
                    className="bg-accent animate-hero-tab absolute bottom-0 left-0 h-0.5 w-full origin-left group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex">
        {/* Icon rail — a mouse shortcut mirroring the tabs (keyboard and
            screen-reader users already have the tablist), path on hover */}
        <div
          aria-hidden="true"
          className="border-border-subtle flex w-10 shrink-0 flex-col items-center gap-1 border-r py-2"
        >
          {TABS.map(({ id, file }, i) => {
            const Icon = RAIL_ICONS[id];
            const selected = i === active;
            return (
              <button
                key={id}
                type="button"
                tabIndex={-1}
                title={file}
                onClick={() => setActive(i)}
                className={`rounded-control relative flex h-8 w-8 items-center justify-center transition-colors ${
                  selected
                    ? "bg-surface text-accent"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {selected && (
                  <span className="bg-accent absolute top-1.5 bottom-1.5 -left-1 w-0.5 rounded-full" />
                )}
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {/* Active file */}
        <div
          id="hero-tabpanel"
          role="tabpanel"
          aria-labelledby={`hero-tab-${tab.id}`}
          className="min-w-0 flex-1"
        >
          <p className="border-border-subtle text-text-muted flex items-center gap-2 border-b px-4 py-2 font-mono text-xs">
            {tab.lang === "shell" ? (
              <SquareTerminal className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <FileCode2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {tab.file}
          </p>
          <pre
            key={tab.id}
            className="text-text-primary animate-hero-code h-80 overflow-x-auto overflow-y-hidden px-4 py-3 font-mono text-[13px] leading-6 [scrollbar-width:none]"
          >
            <code>
              {tab.code.split("\n").map((line, i) => (
                <span key={i} className="flex">
                  <span
                    aria-hidden="true"
                    className="text-text-muted/50 w-8 shrink-0 select-none"
                  >
                    {tab.lang === "shell" ? "" : i + 1}
                  </span>
                  <span className="whitespace-pre">
                    {highlight(line, tab.lang).map(([cls, text], j) => (
                      <span key={j} className={cls || undefined}>
                        {text}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;
