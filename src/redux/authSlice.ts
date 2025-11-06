import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  phone: string | null;
  name: string | null;
  userId?: string | null;
}

const initialState: AuthState = {
  token: null,
  phone: null,
  name: null,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData(state, action) {
      state.phone = action.payload.phone;
      state.name = action.payload.name;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    logout(state) {
      state.token = null;
      state.phone = null;
      state.name = null;
    },
  },
});

export const { setToken, logout, setUserData } = authSlice.actions;
export default authSlice.reducer;
