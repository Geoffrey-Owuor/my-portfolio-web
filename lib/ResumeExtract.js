import "server-only";

// Turns the résumé PDF into blocks the /resume page can style as HTML. A PDF
// has no structure, only positioned text, so this reads it the way a person
// would: the largest text is the name, bold capitals on their own line are
// section headings, indented lines are list items, and so on. It runs once
// per upload (or on request from /manage), never per visit, and the owner
// can hide the result when a layout doesn't read well.
//
// Output, stored as JSON beside the PDF:
//   { version, blocks: [{ type, runs }] }
//   type: "title" | "meta" | "heading" | "entry" | "paragraph" | "item"
//   runs: [{ text, bold?, href? }]
// "meta" lines are the contact lines under the name; "entry" lines open an
// entry (an employer, a role, a school) with a bold lead.

export const RESUME_HTML_VERSION = 1;

// Lines closer than this (in multiples of the body font size) belong to the
// same paragraph or item; a wider gap starts a new one.
const SAME_BLOCK_GAP = 1.4;
// How far right of the body's left edge a line must start to count as
// indented (a list item), in points.
const INDENT_MIN = 8;
const BULLET = /^[•●▪■◦‣∙·*–-]\s+/u;

const loadPdfjs = async () => {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // Server-side there is no Web Worker: pdf.js runs its worker code on the
  // main thread when it finds it here. Importing it directly (rather than
  // letting pdf.js load it by path) also makes sure it's deployed.
  globalThis.pdfjsWorker ??= await import(
    "pdfjs-dist/legacy/build/pdf.worker.mjs"
  );
  return pdfjs;
};

const fontSizeOf = (item) => Math.hypot(item.transform[2], item.transform[3]);

const isBoldFont = (page, fontName) => {
  if (!page.commonObjs.has(fontName)) return false;
  const font = page.commonObjs.get(fontName);
  return Boolean(font?.bold) || /bold|black|heavy|semibold/i.test(font?.name);
};

// Link annotations, in the same coordinate space as the text.
const readLinks = async (page) =>
  (await page.getAnnotations())
    .filter((a) => a.subtype === "Link" && /^(https?:|mailto:)/.test(a.url))
    .map(({ url, rect }) => ({ href: url, rect }));

const linkAt = (links, x, y) =>
  links.find(
    ({ rect: [x1, y1, x2, y2] }) => x >= x1 && x <= x2 && y >= y1 && y <= y2,
  )?.href;

// Every text item on every page, grouped into visual lines.
const readLines = async (doc) => {
  const lines = [];
  for (let number = 1; number <= doc.numPages; number++) {
    const page = await doc.getPage(number);
    // Loads the fonts into commonObjs, which is where bold is read from.
    await page.getOperatorList();
    const [{ items }, links] = await Promise.all([
      page.getTextContent(),
      readLinks(page),
    ]);
    const pageWidth = page.view[2] - page.view[0];

    const pieces = items
      .filter((item) => item.str.trim())
      .map((item) => {
        const [, , , , x, y] = item.transform;
        const size = fontSizeOf(item);
        return {
          text: item.str,
          x,
          y,
          width: item.width,
          size,
          bold: isBoldFont(page, item.fontName),
          href: linkAt(links, x + item.width / 2, y + size / 3),
        };
      });

    // Top to bottom, then left to right; pieces within half a font size of
    // each other vertically share a line.
    pieces.sort((a, b) => b.y - a.y || a.x - b.x);
    for (const piece of pieces) {
      const line = lines.at(-1);
      if (
        line?.page === number &&
        Math.abs(line.y - piece.y) < piece.size / 2
      ) {
        line.pieces.push(piece);
      } else {
        lines.push({ page: number, y: piece.y, pageWidth, pieces: [piece] });
      }
    }
  }

  for (const line of lines) {
    line.pieces.sort((a, b) => a.x - b.x);
    const first = line.pieces[0];
    const last = line.pieces.at(-1);
    line.x = first.x;
    line.right = last.x + last.width;
    line.size = Math.max(...line.pieces.map((piece) => piece.size));
    line.runs = toRuns(line.pieces);
    line.text = line.runs.map((run) => run.text).join("");
    line.allBold = line.pieces.every((piece) => piece.bold);
  }
  return lines;
};

// Joins a line's pieces into runs of the same weight and link. Ligatures
// ("fi", "ff") arrive as separate pieces with no gap, so a space is only
// added where the PDF leaves visible room.
const toRuns = (pieces) => {
  const runs = [];
  let previous = null;
  for (const piece of pieces) {
    const gap = previous ? piece.x - (previous.x + previous.width) : 0;
    const space =
      previous &&
      gap > piece.size * 0.15 &&
      !/\s$/.test(previous.text) &&
      !/^\s/.test(piece.text)
        ? " "
        : "";
    const run = runs.at(-1);
    if (run && run.bold === piece.bold && run.href === piece.href) {
      run.text += space + piece.text;
    } else {
      if (run && space) run.text += space;
      runs.push({ text: piece.text, bold: piece.bold, href: piece.href });
    }
    previous = piece;
  }
  return tidyRuns(runs);
};

const tidyRuns = (runs) => {
  const tidy = runs
    .map((run) => ({ ...run, text: run.text.replace(/\s+/g, " ") }))
    .filter((run) => run.text);
  if (tidy.length) {
    tidy[0].text = tidy[0].text.trimStart();
    tidy.at(-1).text = tidy.at(-1).text.trimEnd();
  }
  return tidy
    .filter((run) => run.text)
    .map(({ text, bold, href }) => ({
      text,
      ...(bold && { bold: true }),
      ...(href && { href }),
    }));
};

// Appends a wrapped line's runs to the block it continues.
const appendRuns = (block, runs) => {
  const last = block.runs.at(-1);
  const [first, ...rest] = runs;
  const joiner = /[-/]$/.test(last.text) ? "" : " ";
  if (last.bold === first.bold && last.href === first.href) {
    last.text += joiner + first.text;
    block.runs.push(...rest);
  } else {
    last.text += joiner;
    block.runs.push(...runs);
  }
};

const mostCommon = (values) => {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0];
};

const isHeadingText = (text) =>
  text.length <= 60 && /\p{L}/u.test(text) && text === text.toUpperCase();

const toBlocks = (lines) => {
  if (!lines.length) return [];

  const round = (n) => Math.round(n * 2) / 2;
  const bodySize = mostCommon(lines.map((line) => round(line.size)));
  const titleSize = Math.max(...lines.map((line) => line.size));
  const hasTitle = titleSize > bodySize * 1.2;
  // The body's left edge: the leftmost start shared by a few body-size
  // lines (list items can outnumber margin lines, so not the most common).
  const starts = new Map();
  for (const line of lines) {
    if (round(line.size) !== bodySize) continue;
    const x = Math.round(line.x);
    starts.set(x, (starts.get(x) ?? 0) + 1);
  }
  const margin = Math.min(
    ...[...starts].filter(([, count]) => count >= 3).map(([x]) => x),
  );

  const blocks = [];
  let seenHeading = false;
  let previousLine = null;

  for (const line of lines) {
    const gap =
      previousLine && previousLine.page === line.page
        ? previousLine.y - line.y
        : Infinity;
    const continues = gap <= bodySize * SAME_BLOCK_GAP;
    previousLine = line;
    const block = blocks.at(-1);

    if (hasTitle && line.size >= titleSize - 0.5) {
      if (block?.type === "title" && continues) appendRuns(block, line.runs);
      else blocks.push({ type: "title", runs: line.runs });
      continue;
    }

    if (line.allBold && isHeadingText(line.text) && line.x <= margin + 2) {
      seenHeading = true;
      blocks.push({ type: "heading", runs: [{ text: line.text }] });
      continue;
    }

    // Anything between the name and the first section heading is contact
    // detail, kept line by line.
    if (!seenHeading) {
      blocks.push({ type: "meta", runs: line.runs });
      continue;
    }

    const bullet = BULLET.test(line.text);
    if (bullet) {
      line.runs[0].text = line.runs[0].text.replace(BULLET, "");
      line.runs = line.runs.filter((run) => run.text);
    }

    if (bullet || line.x > margin + INDENT_MIN) {
      if (!bullet && block?.type === "item" && continues) {
        appendRuns(block, line.runs);
      } else {
        blocks.push({ type: "item", runs: line.runs });
      }
      continue;
    }

    // A line at the margin that leads with bold text and isn't a wrap of
    // the line above opens an entry ("EMPLOYER | City", "Role | Dates").
    if (line.runs[0]?.bold && !(block?.type === "paragraph" && continues)) {
      blocks.push({ type: "entry", runs: line.runs });
      continue;
    }

    if (block?.type === "paragraph" && continues) {
      appendRuns(block, line.runs);
    } else {
      blocks.push({ type: "paragraph", runs: line.runs });
    }
  }

  return blocks.filter((block) => block.runs.length);
};

// Resolves to { version, blocks }, or to null when the PDF yields nothing
// usable (a scanned image, say). Never throws: the HTML view is an extra,
// and a PDF that can't be read must still upload.
export const extractResume = async (bytes) => {
  let task;
  try {
    const pdfjs = await loadPdfjs();
    task = pdfjs.getDocument({
      // pdf.js takes ownership of the buffer it's given.
      data: new Uint8Array(bytes),
      isEvalSupported: false,
      disableFontFace: true,
      useSystemFonts: false,
      verbosity: 0,
    });

    const blocks = toBlocks(await readLines(await task.promise));
    const headings = blocks.filter((block) => block.type === "heading");
    if (headings.length === 0) return null;
    return { version: RESUME_HTML_VERSION, blocks };
  } catch (error) {
    console.error("Failed to extract the résumé's text:", error);
    return null;
  } finally {
    await task?.destroy();
  }
};
