"use client";
import apiClient from "@/lib/AxiosClient";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiClient.post("/logout");
      // Redirect to login and refresh the page state
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button onClick={handleLogout} className="text-red-500">
      Sign Out
    </button>
  );
}
