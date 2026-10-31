# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A personal portfolio + blog site built with Next.js 15 (App Router), React 19, and Tailwind CSS 4, backed by Neon Serverless Postgres, deployed on Vercel. Content sections (skills, stack, projects, experience, education) are database-driven; the site also has a full blog CRUD flow gated behind a custom JWT auth system.

## Commands

- `npm run dev` — start dev server with Turbopack
- `npm run build` — production build. Don't run it while a dev server is running: both write to `.next`, and the build breaks the dev server (500s until it's restarted). To check a build with a dev server up, build a copy of the repo outside the project folder instead.
- `npm run start` — run production build
- `npm run lint` — run `eslint .` (flat config in `eslint.config.mjs`, `next/core-web-vitals` rules, covers .js/.jsx)
- `npm run format` / `npm run format:check` — Prettier write / check

There is no test suite configured in this repo.

Prettier is configured via `.prettierrc` with `prettier-plugin-tailwindcss` (auto-sorts Tailwind classes) — run through your editor or `npx prettier --write .`.

Path alias: `@/*` maps to the repo root (see `jsconfig.json`), e.g. `@/lib/db`, `@/components/...`.

## Architecture

### Data layer

- `lib/db.js` exports a single `query(queryString, params)` helper built on `@neondatabase/serverless`'s `Pool`. It uses a global singleton pool in development (`globalThis.postgresPool`) to survive HMR, and a fresh pool in production. All raw SQL lives inline in the calling module — there is no ORM/query builder.
- `cache/CachedData.js`, `cache/BlogsData.js` wrap DB reads in `unstable_cache(fn, [key], { tags: [...] })`, so homepage sections (skills, stack, projects, experience, education) and blog listings are cached and only re-fetched on tag-based revalidation.
- Cache invalidation happens two ways:
  - `app/api/revalidate/route.js` — `GET` endpoint that calls `revalidatePath("/")`, gated by a `?secret=` query param checked against `REVALIDATE_KEY`.
  - `app/api/revalidate/revalidatetag/route.js` — tag-based revalidation, also secret-gated.
  - `cache/revalidateBlogsData.js` — server action that calls `revalidateTag("BlogsData")`, invoked after blog create/update/delete.
- Server Components fetch directly (e.g. `components/Home/Skills.jsx` calls `getCachedSkills()` at render time) — no client-side data fetching for initial content; client interactivity/mutations go through `lib/AxiosClient.js`.

### Auth

Custom-rolled JWT auth, split across three layers:

- `lib/Auth.js` — token signing/verification using `jose` (HS256), bcrypt password hashing, `ACCESS_TOKEN_SECRET` (15 min expiry) and `REFRESH_TOKEN_SECRET` (7 day expiry). Refresh tokens are additionally hashed and stored in the `users` table so they can be revoked server-side; `requireSession()` and `verifyAccessTokenJWT()` are the main entry points for Server Components/route handlers.
- `middleware.js` — Edge middleware (matches `/createblog`, `/login`, `/blog/:path*`) that redirects unauthenticated users away from `/createblog` and redirects already-logged-in users away from `/login`. It also verifies the refresh token and injects `x-user-id` into request headers for downstream Server Components — but this is advisory (guest browsing continues if verification fails), not itself an authorization boundary.
- `lib/AxiosClient.js` — client-side axios instance (`baseURL: /api`, `withCredentials: true`) with a response interceptor that, on a 401, calls `/api/refresh-token` once and retries the original request; if refresh fails it hard-redirects to `/login`.
- Route handlers under `app/api/{login,logout,refresh-token}` do the actual cookie issuance (`accessToken`, `refreshToken` — both `httpOnly`, `sameSite: lax`, `secure` in production) and DB-side refresh-token rotation/revocation.

When adding a new protected route or mutation, follow the existing pattern: verify via `verifyAccessTokenJWT()`/`requireSession()` inside the route handler or Server Component itself — don't rely solely on the middleware matcher.

### App Router structure

- Route groups: `app/(auth)/login`, `app/(blogposts)/blog/[id]` and `app/(blogposts)/blogs` — grouped for organization only, no shared layout side effects beyond routing.
- `app/api/*` — REST-style route handlers (`route.js`) for login/logout/refresh, blog CRUD (`blogpost`, `blogpost/[id]`, `updateblog`), contact form (`submitfeedback`), and cache revalidation.
- `app/layout.js` defines global metadata (Open Graph/Twitter defaults, icons) and wraps every page in `Providers` (theme), `ToastProvider` (+ `NetworkStatus`), a persistent `NavBar`/`Footer`.

### Component organization (`components/`)

- `Home/` — one component per homepage section (Hero, Skills, Stack, Projects, Experience, Education, Contact, NavBar, Footer); these are Server Components that fetch their own data.
- `Wrappers/` — presentational/client wrapper components that receive fetched data as props from their `Home/` counterpart (e.g. `SkillsWrapper`, `ProjectsWrapper`) — this is the seam between server data-fetching and client interactivity/animation. `SectionTitle` is shared by every section and also owns the section note: pass it `alertMessage` + `alertIcon` and it self-triggers a timed note that briefly takes the place of the section's `~/path` (right of the subtitle) when that title scrolls into view (both props optional — omit them for a plain heading).
- `blog/` — blog authoring/viewing pipeline: `BlogForm` → `CustomMdEditor` (markdown editing) → `PreviewModal` → `ViewBlog`/`BlogPost` (rendering via `react-markdown` + `remark-gfm`), plus `BlogCardView`/`BlogTableView` for listing layouts and `EditBlog` for updates.
- `Modules/` — cross-cutting UI primitives: `Toaster` (the app's only notification system: `ToastProvider` is mounted once in `app/layout.js`; call `useToast()` → `toast.success/error/info(message, { title, id, duration, icon })` from any client component — a repeated `id` replaces in place; field errors stay inline in their form), `ConfirmationDialog`, `Pagination`, `NetworkStatus` (headless; drives the offline/back-online toast), `LogoutOverlay`/`LogoutButton`.
- `Skeletons/` — loading-state placeholders paired 1:1 with sections/components, used via `<Suspense fallback={...}>` in `app/page.js` and other async pages.
- `Theme/` — `next-themes`-based dark mode (`Providers`, `ThemeToggleCompact`, `TooltipUI`).

### Email

Two parallel email paths exist:

- `services/EmailSender.js` — Gmail send via OAuth2 (`GMAIL_USER`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`) through nodemailer, and/or Resend (`RESEND_API_KEY`).
- `lib/SendMail.js` — uses `RECIPIENT_EMAIL` for the contact form target address.
- `utils/EmailTemplate.js` — HTML email template used by the contact form (`app/api/submitfeedback`).

### Styling

Tailwind CSS 4 with the new CSS-first config (`@theme` block in `styles/globals.css`, no `tailwind.config.js`). Dark mode is driven by a custom variant keyed on `[data-theme=dark]` (set by `next-themes`), not Tailwind's default `dark:` media-query strategy. A custom breakpoint `custom-content` (1100px) is defined there.

Design tokens live in `styles/globals.css` — use them instead of raw values so the UI can't drift:

- **Colour:** semantic tokens (`bg-surface`, `bg-surface-raised`, `text-text-primary`, `text-text-muted`, `border-border-subtle`, `text-accent`, `text-success`, `text-danger`), redefined per theme. Avoid raw `gray-*`/hex.
- **Type:** headings use `text-display` (hero), `text-h1` (page titles), `text-h2` (section titles), `text-h3` (card titles) in the reading font; `font-mono` is for labels, indices, paths and code only.
- **Layout:** `container-page` (max-w-7xl + shared gutter) for every top-level block; `section-shell` (container + `py-section` rhythm) for homepage sections and their skeletons; `--header-h` for anything that must clear the sticky header.
- **Radius, by role:** `rounded-chip` (kbd, tags, skeleton text bars), `rounded-control` (buttons, inputs, tabs, menu rows), `rounded-card` (cards, panels, popovers, toasts), `rounded-dialog` (modals); `rounded-full` for pills/avatars.
- **Stacking:** only the named layers `z-raised` < `z-header` < `z-drawer` < `z-modal` < `z-overlay` < `z-toast` < `z-progress`; add a new layer there rather than a raw `z-*`.

### Working on proposed changes (`.claude/skills/CHANGES.md`)

Proposed bug fixes and UI/UX changes are written up in `.claude/skills/CHANGES.md`. Each time you pick that file up:

- **Clarify first.** If anything in a proposal is ambiguous, ask before you implement. Put every open question in one round of multiple-choice questions, with a recommended option where you have one.
- **Critique and recommend.** Say so if a proposal has trade-offs, edge cases (mobile, dark mode, accessibility) or a better alternative, and point out related bugs you notice along the way.
- **Phase the work.** Split larger changes into phases. Verify each phase before you commit it, and use one focused commit per change.
- **Verify in the running app.** A signed-in dev server is usually running at `localhost:3000` in Chrome, so check there first. If none is running, start one (`npm run dev`). If you're blocked (e.g. a sign-in is needed, or the browser can't reach the server), ask the user to step in rather than skipping verification.
