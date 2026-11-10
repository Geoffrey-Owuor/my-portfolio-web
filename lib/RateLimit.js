import { query } from "@/lib/db";

// Fixed-window rate limiting on the rate_limits table (see
// db/migrations/001_rate_limits.sql). Serverless instances share no memory,
// so the counters live in Postgres, and one upsert both counts the hit and
// starts a fresh window once the old one has run out.
//
// Fails open: if the table is missing or the database is unreachable the
// request goes through, because a broken limiter must not lock the owner out
// of their own login.
export async function rateLimit(key, { limit, windowSeconds }) {
  try {
    const [row] = await query(
      `INSERT INTO rate_limits AS r (key, hits, window_start)
       VALUES ($1, 1, NOW())
       ON CONFLICT (key) DO UPDATE SET
         hits = CASE
           WHEN r.window_start <= NOW() - make_interval(secs => $2) THEN 1
           ELSE r.hits + 1
         END,
         window_start = CASE
           WHEN r.window_start <= NOW() - make_interval(secs => $2) THEN NOW()
           ELSE r.window_start
         END
       RETURNING hits,
         CEIL(EXTRACT(EPOCH FROM (
           window_start + make_interval(secs => $2) - NOW()
         )))::int AS retry_after`,
      [key, windowSeconds],
    );

    // Expired rows are swept now and then rather than on every request.
    if (Math.random() < 0.02) {
      query(
        "DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '1 day'",
      ).catch(() => {});
    }

    return {
      allowed: row.hits <= limit,
      retryAfter: Math.max(row.retry_after, 1),
    };
  } catch (error) {
    console.error("Rate limiter unavailable, allowing the request:", error);
    return { allowed: true, retryAfter: 0 };
  }
}

// Vercel puts the caller first in x-forwarded-for.
export const clientIp = (request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
  request.headers.get("x-real-ip") ||
  "unknown";

// "in 40 seconds", "in 12 minutes" — for the message on a 429.
export const describeWait = (seconds) => {
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
};
