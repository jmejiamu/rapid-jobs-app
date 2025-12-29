import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  phone: string | null;
  name: string | null;
  userId?: string | null;
  deviceToken?: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  phone: null,
  name: null,
  userId: null,
  deviceToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData(state, action) {
      state.phone = action.payload.phone;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
      state.deviceToken = action.payload.deviceToken;
    },
    setToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    logout(state) {
      state.accessToken = null;
      state.phone = null;
      state.name = null;
    },
  },
});

export const { setToken, logout, setUserData } = authSlice.actions;
export default authSlice.reducer;
