# DESIGN.md

Design intent for the portfolio redesign. This document is the source of truth for the redesign — it exists so that every future layout, copy, and component decision can be checked against a stated intent instead of improvised in the moment. Nothing below authorizes touching components; it defines what a later implementation pass must be consistent with.

## Subject & Audience

**Who:** A full-stack builder — someone who ships complete systems end-to-end (frontend, backend, infra), not a specialist narrowed to one layer of the stack.

**Audience:** Technical hiring managers and engineering collaborators evaluating this person for a hire or a serious working relationship — not recruiters skimming for keywords, not other designers judging the visual craft for its own sake.

**The 5-second read:** A visitor should immediately register *"this person builds whole products, not just UI or just APIs, and the site itself is proof — it's fast, custom-built, and clearly not a template."* The site's own construction (a hand-rolled JWT auth system, a real Postgres-backed CMS, tag-based cache invalidation) is part of the pitch; the design should not hide that under decoration.

## Primary Job

**Get a hire / interview.** Every section is in service of moving a hiring manager toward reaching out or advancing this person to an interview. Consequences of this priority:

- The experience/work section carries the most weight on the page — it should be reachable and scannable faster than any decorative or introductory content.
- Project write-ups need to read like engineering case studies (problem → decisions → tradeoffs → outcome), not just screenshots + a stack badge list.
- Contact is a means to the job outcome, not the outcome itself — the CTA should point at "talk about a role / a project," not a generic "let's connect."
- Content is mostly real (DB-driven Projects, Experience, Skills, Education — see `cache/CachedData.js`) — the redesign should assume real copy is available and design for actual content density, not lorem-ipsum-shaped boxes.

## Locked Color Tokens

These come directly from the `@theme` / semantic-token layer already implemented in `styles/globals.css`. The redesign **must use these tokens** — no new hex/rgb literals, no new hues. Ramps exist for four hues only: neutral (gray), accent (blue), danger (red), success (green).

**Semantic tokens (theme-aware, use these in components — do not reach for raw ramp steps):**

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-surface` | `#ffffff` | `--color-gray-950` | Page background |
| `--color-surface-raised` | `--color-gray-50` | `--color-gray-800` | Cards, panels, elevated surfaces |
| `--color-text-primary` | `--color-gray-900` | `--color-gray-100` | Headings, body copy |
| `--color-text-muted` | `--color-gray-500` | `--color-gray-400` | Secondary/meta text |
| `--color-border-subtle` | `--color-gray-200` | `--color-gray-700` | Dividers, decorative borders |
| `--color-accent` | `--color-blue-600` | `--color-blue-400` | Links, primary CTAs, focus states |
| `--color-accent-hover` | `--color-blue-700` | `--color-blue-300` | Hover/active state of accent |
| `--color-success` | `--color-green-700` | `--color-green-400` | Success/confirmation states |
| `--color-danger` | `--color-red-600` | `--color-red-400` | Error/destructive states |

**Ramps backing them:** `--color-gray-{50..950}`, `--color-blue-{50..950}`, `--color-red-{50..900}`, `--color-green-{50..900}`, all defined in OKLCH in `styles/globals.css`'s `@theme` block. Blue is the only accent hue — there is no secondary/tertiary brand color, and the redesign should not invent one (see Banned List).

## Typography Roles

The project already loads two typefaces via `next/font` (`--font-dmsans`, `--font-dm-mono` in `styles/globals.css`) — the redesign builds on these rather than introducing new families. Neither is Inter or Roboto.

- **Display (DM Mono):** Name, hero headline, section titles, nav labels. Using a monospace face for display type — not just for code — is the deliberate technical signal: it reads as "this person thinks in code" before a visitor reads a single word. Set at a size and tracking wide enough that it doesn't feel like a code block.
- **Body (DM Sans):** Bio copy, project case-study prose, experience descriptions. A humanist grotesque was chosen over mono for anything meant to be read in paragraphs — DM Mono at body-text size and length actively hurts readability; DM Sans keeps long-form content comfortable while still pairing cleanly with the mono display face.
- **Mono / utility (DM Mono, reused):** Timestamps, tech-stack tags, status labels, code snippets, terminal-style affordances (`$`, `>`, `~/projects` breadcrumbs). Reusing the display face here — rather than introducing a third family — is what makes the mono choice feel systemic rather than decorative.

## Motion Philosophy

Motion exists to demonstrate engineering craft and direct attention to content that matters for the hiring decision — not to entertain.

**What animates:**
- A one-time, fast (~400–600ms) typewriter/terminal-reveal on the hero identity line, echoing the display typeface's "this is code" signal.
- State transitions that confirm an action happened: form submission, theme toggle, alert appearance — all already partially present via the existing `Alert`/`slideUp`/`slideDown` keyframes.
- Focus/hover feedback on interactive elements (links, buttons, project cards) — subtle, fast (~150ms), no overshoot/bounce easing.
- Scroll-triggered *appearance* of section content (fade + small translate, not choreography) so long case-study pages don't dump everything at once.

**What explicitly does not animate:**
- No decorative background motion (floating blobs, particle fields, animated gradients) — nothing that moves without the user doing something or new content arriving.
- No scroll-jacking, parallax layers, or scroll-linked storytelling — the hiring manager is skimming, not exploring a narrative.
- No auto-playing carousels or slideshows for projects — a hiring manager should control pacing, not wait on a timer.
- No hover-scale-everything — cards and buttons get a state change (color/border/shadow shift via the token layer), not a transform-scale bounce.

## Signature Element

**A functional terminal/command affordance in the hero — not a decorative typing animation, an actually operable one.** A small command-line-styled input (or a fixed set of "commands" as clickable chips styled like commands: `whoami`, `cat experience.md`, `open resume`) that navigates the site or surfaces content when used. This is the one thing the site should be remembered for, because it does three things at once that a static hero can't: proves front-end capability in the first five seconds (matching the "full-5-second-read" goal), reinforces the terminal-inspired typographic system instead of sitting apart from it, and gives a hiring manager a literal, low-friction path to the thing they came for (`open resume`, `cat experience.md`) instead of making them hunt through nav.

## Banned List

Generic AI-design patterns this redesign must not reproduce:

- Purple/indigo gradients used as a decorative brand wash (note: the codebase's current `Footer`/`LoadingLine`/`ViewBlog` gradients using indigo/purple/pink are exactly this pattern and are flagged for removal or replacement during implementation, not preservation).
- Glassmorphism cards (frosted blur + translucent white/black panel) as a default surface treatment.
- `01 / 02 / 03`-style numbered section labels unless the content is a real, meaningful sequence (e.g. actual chronological steps in a process) — not used just to make sections feel "designed."
- Generic three-column icon-in-a-card feature grids as a way to fill space.
- The default hero formula: big centered headline + subtext paragraph + two pill buttons ("View Work" / "Contact Me").
- Cliché copy: "Let's build something amazing together," "Passionate about creating,"  and similar filler that could appear on any portfolio regardless of who wrote it.
