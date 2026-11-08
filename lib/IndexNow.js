import { SITE_URL } from "@/utils/metadata";

// Public by design: search engines confirm it against /<key>.txt in public/.
const INDEXNOW_KEY = "36489eb461dee451c1c95ca544ec56b5";

// Tells Bing and the other IndexNow engines that these pages changed. Limited
// to production so local and preview edits never announce their URLs, and a
// failure is only logged because the post itself has already been saved.
export async function notifyIndexNow(paths) {
  if (process.env.VERCEL_ENV !== "production") return;

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: paths.map((path) => `${SITE_URL}${path}`),
      }),
    });

    if (!response.ok) {
      console.error("IndexNow rejected the update:", response.status);
    }
  } catch (error) {
    console.error("Failed to notify IndexNow:", error);
  }
}
