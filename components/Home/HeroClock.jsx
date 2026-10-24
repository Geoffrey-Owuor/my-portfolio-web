"use client";

import { useEffect, useState } from "react";

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Nairobi",
  hour: "2-digit",
  minute: "2-digit",
});

// Local time in Nairobi, so visitors in other timezones know when to expect a
// reply. Rendered only after mount: the server's clock would never match the
// client's at hydration.
const HeroClock = () => {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const update = () => setTime(timeFormat.format(new Date()));
    update();
    const interval = setInterval(update, 15_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-text-muted text-sm">
      Nairobi{" "}
      <time className="text-text-primary font-mono tabular-nums">
        {time ?? "--:--"}
      </time>{" "}
      EAT
    </span>
  );
};

export default HeroClock;
