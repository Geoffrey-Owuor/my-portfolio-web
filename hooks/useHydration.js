"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // This listener runs as soon as Zustand finishes
    // pulling data from localStorage into the store.
    const unsubHydrate = useUserStore.persist.onHydrate(() =>
      setHydrated(false),
    );
    const unsubFinishHydration = useUserStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );

    // Also check if it's already hydrated (for fast internal navigation)
    setHydrated(useUserStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};
