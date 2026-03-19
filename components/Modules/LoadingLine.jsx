"use client";

import { useEffect, useState } from "react";
import ClientPortal from "./ClientPortal";

const LoadingLine = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Jump start to 10% immediately
    Promise.resolve().then(() => setProgress(10));

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;

        const remaining = 95 - prev;
        const jump = Math.max(0.5, remaining * 0.05);
        return prev + jump;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const content = (
    <div className="fixed top-0 right-0 left-0 z-9999 h-0.5 bg-transparent">
      <div
        className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  return <ClientPortal>{content}</ClientPortal>;
};

export default LoadingLine;
