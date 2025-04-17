import { RootState } from "@/app/redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initialStateType {
  isSidebarCollaps: boolean;
  isDarkMode: boolean;
}

const initialState: initialStateType = {
  isSidebarCollaps: false,
  isDarkMode: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollaps: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollaps = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { setIsSidebarCollaps, setIsDarkMode } = globalSlice.actions;
export const isSidebarCollapsValue = (state: RootState) =>
  state.global.isSidebarCollaps;
export const isDarkModeValue = (state: RootState) => state.global.isDarkMode;

export default globalSlice.reducer;
