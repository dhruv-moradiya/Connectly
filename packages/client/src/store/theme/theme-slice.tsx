import { createSlice } from "@reduxjs/toolkit";
import type { TTheme } from "@/types/index.type";

type ThemeProviderState = {
  theme: TTheme;
};

const initialState: ThemeProviderState = {
  theme: "system",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

const themeReducer = themeSlice.reducer;
export { themeReducer };
export const { toggleTheme } = themeSlice.actions;
