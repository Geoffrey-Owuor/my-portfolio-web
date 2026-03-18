"use client";

import { useRef } from "react";
import { useUserStore } from "@/store/useUserStore";

export default function UserInitializer({ user }) {
  // We use a ref to ensure this only runs ONCE per page load
  const initialized = useRef(false);

  const userObject = {
    name: user.name,
    id: user.id,
    email: user.email,
  };

  if (!initialized.current) {
    useUserStore.getState().setUser(userObject);
    initialized.current = true;
  }

  return null; // This component renders nothing
}
