import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      name: null,
      email: null,
      id: null,

      setUser: (user) =>
        set({
          name: user.name,
          email: user.email,
          id: user.id,
        }),

      resetUser: () =>
        set({
          name: null,
          email: null,
          id: null,
        }),
    }),
    {
      name: "user-storage", // Unique name for the item in localStorage
      storage: createJSONStorage(() => localStorage), // Defaults to localStorage
    },
  ),
);

// Call this before the React tree renders
export const initializeUserStore = (user) => {
  const { id } = useUserStore.getState();
  if (id !== user.id) useUserStore.setState(user); // only set if not already initialized
};
