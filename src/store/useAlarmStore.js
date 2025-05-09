import { create } from "zustand";

export const useAlarmStore = create((set) => ({
  hasUnread: false,
  setHasUnread: (val) => set({ hasUnread: val }),
})); 