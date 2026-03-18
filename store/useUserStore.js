import { create } from "zustand";

export const useUserStore = create((set) => ({
  name: null,
  email: null,
  id: null,

  setUser: (user) => set({ name: user.name, email: user.email, id: user.id }),

  resetUser: () => set({ name: null, email: null, id: null }),
}));
