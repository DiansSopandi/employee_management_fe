// store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Permission {
  id: number;
  resource: string;
  action: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface AuthState {
  user: { id: number; email: string } | null;
  roles: Role[];
  permissions: Permission[];
  accessToken?: string | null;
}

const initialState: AuthState = {
  user: null,
  roles: [],
  permissions: [],
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        id: number;
        email: string;
        accessToken: string;
        roles: Role[];
      }>
    ) => {
      state.user = { id: action.payload.id, email: action.payload.email };
      state.roles = action.payload.roles;
      state.permissions = state.roles.flatMap((r) => r.permissions);
      state.accessToken = action.payload.accessToken;
    },
    logout: (state) => {
      state.user = null;
      state.roles = [];
      state.permissions = [];
      state.accessToken = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
