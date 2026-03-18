"use client";
import { useHydration } from "@/hooks/useHydration";
import { useUserStore } from "@/store/useUserStore";
import { PenLine } from "lucide-react";

const EditButton = ({ setShowEditBlog }) => {
  const userId = useUserStore((state) => state.id);
  const hydrated = useHydration();
  return (
    <>
      {!hydrated && (
        <div className="h-4 w-[57px] animate-pulse rounded-full bg-gray-200 dark:bg-gray-600"></div>
      )}
      {userId && hydrated && (
        <button
          onClick={() => setShowEditBlog(true)}
          className="flex cursor-pointer items-center gap-2 transition-colors duration-200 hover:text-gray-700 dark:hover:text-gray-500"
        >
          <PenLine className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Edit</span>
        </button>
      )}
    </>
  );
};

export default EditButton;
