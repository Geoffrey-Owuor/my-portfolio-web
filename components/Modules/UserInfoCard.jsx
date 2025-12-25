"use client";

import { UserRound } from "lucide-react";
import { useUser } from "@/context/UserContext";

const UserInfoCard = () => {
  const { email, name } = useUser();

  // Generate initials from user_name if available
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  return (
    <div className="inline-flex items-center gap-3 rounded-2xl p-3 transition-all hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
      {/* Avatar Circle */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
        {initials ? (
          <span className="text-sm font-bold tracking-tight">{initials}</span>
        ) : (
          <UserRound className="h-5 w-5" />
        )}
      </div>

      {/* User Details */}
      <div className="hidden flex-col lg:flex">
        <span className="max-w-[150px] truncate text-sm font-semibold text-gray-900 dark:text-white">
          {name || "Guest User"}
        </span>
        <span className="max-w-[150px] truncate text-xs text-gray-500 dark:text-gray-400">
          {email || "No email connected"}
        </span>
      </div>
    </div>
  );
};

export default UserInfoCard;
