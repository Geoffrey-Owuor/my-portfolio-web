"use server";
import { cache } from "react";
import { requireSession } from "@/lib/Auth";

export const getSession = cache(async () => {
  return await requireSession();
});
