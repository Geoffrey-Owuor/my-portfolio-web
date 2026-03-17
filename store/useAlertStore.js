import { create } from "zustand";

export const useAlertStore = create((set) => ({
  alerts: [],

  addAlert: ({ message, type, iconComponent }) => {
    const id = Date.now(); //Using the current date as the alert id
    set((state) => ({
      alerts: [{ id, message, type, iconComponent }, ...state.alerts],
    }));

    return id;
  },

  removeAlert: (id) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
}));
