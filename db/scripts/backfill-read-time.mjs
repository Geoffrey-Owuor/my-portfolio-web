// One-off: recompute every post's read_time with the current formula
// (utils/markdownText.js: rendered words, not raw Markdown). New and edited
// posts already get it from the blog routes.
//
//   node --env-file=.env db/scripts/backfill-read-time.mjs            dry run
//   node --env-file=.env db/scripts/backfill-read-time.mjs --apply    write
//
// Add --revalidate=<origin> (repeatable, e.g. --revalidate=http://localhost:3000)
// to refresh that deployment's cached blog list afterwards (needs
// REVALIDATE_KEY). Only read_time changes: updated_at is left alone, so posts
// don't start showing an "updated" date.
import { Pool } from "@neondatabase/serverless";
import { estimateReadTime } from "../../utils/markdownText.js";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const origins = args
  .filter((arg) => arg.startsWith("--revalidate="))
  .map((arg) => arg.slice("--revalidate=".length).replace(/\/+$/, ""));

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set (run with --env-file=.env)");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  const { rows } = await pool.query(
    "SELECT id, slug, read_time, blog_content FROM blogs ORDER BY blog_date",
  );

  const changes = rows
    .map((row) => ({ ...row, next: estimateReadTime(row.blog_content) }))
    .filter((row) => row.next !== row.read_time);

  for (const row of rows) {
    const next = estimateReadTime(row.blog_content);
    const mark = next === row.read_time ? " " : "*";
    console.log(`${mark} ${row.slug}: ${row.read_time} -> ${next}`);
  }
  console.log(`\n${changes.length} of ${rows.length} posts change.`);

  if (!apply) {
    console.log("Dry run: nothing written. Add --apply to write.");
  } else if (changes.length > 0) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const row of changes) {
        await client.query("UPDATE blogs SET read_time = $1 WHERE id = $2", [
          row.next,
          row.id,
        ]);
      }
      await client.query("COMMIT");
      console.log(`Updated ${changes.length} posts.`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  if (apply && origins.length > 0) {
    const key = process.env.REVALIDATE_KEY;
    if (!key) {
      console.warn("REVALIDATE_KEY is not set: skipping revalidation.");
    }
    for (const origin of key ? origins : []) {
      const response = await fetch(
        `${origin}/api/revalidate/revalidatetag?tag=BlogsData`,
        { method: "POST", headers: { Authorization: `Bearer ${key}` } },
      );
      console.log(`Revalidated BlogsData on ${origin}: ${response.status}`);
    }
  }
} finally {
  await pool.end();
}
