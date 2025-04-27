import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  isDarkMode: boolean;
};

type Actions = {
  toggleDarkMode: () => void;
};

export const useThemeStore = create(
  persist<State & Actions>(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () =>
        set((state) => ({ ...state, isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "theme",
    }
  )
);
