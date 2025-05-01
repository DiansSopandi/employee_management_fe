import { RootState } from "@/app/redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateType {
  isSidebarCollaps: boolean;
  isDarkMode: boolean;
  isFormShow: boolean;
}

const initialState: InitialStateType = {
  isSidebarCollaps: false,
  isDarkMode: false,
  isFormShow: false,
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
    setIsFormShow: (state, action: PayloadAction<boolean>) => {
      state.isFormShow = action.payload;
    },
  },
});

export const { setIsSidebarCollaps, setIsDarkMode, setIsFormShow } =
  globalSlice.actions;

export const isSidebarCollapsValue = (state: RootState) =>
  state.global.isSidebarCollaps;
export const isDarkModeValue = (state: RootState) => state.global.isDarkMode;
export const isFormShowValue = (state: RootState) => state.global.isFormShow;

export default globalSlice.reducer;
