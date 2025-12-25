"use client";

import { useState } from "react";
import apiClient from "@/lib/AxiosClient";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import LogoutOverlay from "./LogoutOverlay";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiClient.post("/logout");
      // Redirect to login and refresh the page state
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {isLoggingOut && <LogoutOverlay />}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex w-full items-center gap-3 rounded-lg bg-gray-200 px-4 py-2.5 text-sm text-gray-600 transition-all hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-900/50 dark:hover:text-red-400"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden lg:inline-block">Sign Out</span>
      </button>
    </>
  );
}
