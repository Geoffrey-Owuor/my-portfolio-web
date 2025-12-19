"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AutoRefresh = () => {
  const router = useRouter();

  //  UseEffect that refreshes the route every 5 second interval
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 5000);

    return () => clearInterval(interval);
  }, [router]);

  return null; //This component returns nothing
};

export default AutoRefresh;
