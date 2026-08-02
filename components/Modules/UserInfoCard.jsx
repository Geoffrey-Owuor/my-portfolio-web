"use client";

import { UserRound } from "lucide-react";

const UserInfoCard = ({ user }) => {
  const { name, email } = user;

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
    <div className="hover:bg-surface-raised hidden items-center gap-3 rounded-2xl p-3 transition-colors sm:inline-flex">
      {/* Avatar Circle */}
      <div className="bg-surface-raised text-text-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        {initials ? (
          <span className="text-sm font-bold tracking-tight">{initials}</span>
        ) : (
          <UserRound className="h-5 w-5" />
        )}
      </div>

      {/* User Details */}
      <div className="hidden flex-col lg:flex">
        <span className="text-text-primary max-w-[150px] truncate text-sm font-semibold">
          {name || "Guest User"}
        </span>
        <span className="text-text-muted max-w-[150px] truncate text-xs">
          {email || "No email connected"}
        </span>
      </div>
    </div>
  );
};

export default UserInfoCard;
