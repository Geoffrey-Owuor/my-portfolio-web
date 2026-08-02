"use client";

import { useState } from "react";
import apiClient from "@/lib/AxiosClient";

import { LogOut } from "lucide-react";
import LogoutOverlay from "./LogoutOverlay";

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiClient.post("/logout");
      window.location.href = "/login";
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
        className="bg-surface-raised text-text-muted hover:bg-danger/10 hover:text-danger flex w-full items-center gap-3 rounded-full px-2.5 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-70 lg:px-6"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden lg:inline-block">Sign Out</span>
      </button>
    </>
  );
}
