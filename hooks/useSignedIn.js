import { useEffect, useState } from "react";

// Whether this visitor is the signed-in owner, for showing owner-only controls
// on cached public pages. False until the answer arrives. It only hides or
// shows UI: every mutation verifies the session in its own route handler.
export const useSignedIn = () => {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/session", { signal: controller.signal })
      .then((response) => response.json())
      .then((session) => setSignedIn(session.signedIn === true))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return signedIn;
};
