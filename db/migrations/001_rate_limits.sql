-- Fixed-window counters behind lib/RateLimit.js (login attempts and contact
-- form submissions). One row per limited key, e.g. "login:203.0.113.7".
CREATE TABLE IF NOT EXISTS rate_limits (
  key          text PRIMARY KEY,
  hits         integer NOT NULL,
  window_start timestamptz NOT NULL
);
