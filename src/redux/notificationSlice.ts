import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotificationAsync";

export interface NotificationsState {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const initialState: NotificationsState = {
  expoPushToken: null,
  notification: null,
  error: null,
};

export const fetchExpoPushToken = createAsyncThunk(
  "notifications/fetchExpoPushToken",
  async (_, thunkAPI) => {
    try {
      const expoPushToken = await registerForPushNotificationsAsync();
      return expoPushToken;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExpoPushToken.fulfilled, (state, action) => {
      state.expoPushToken = action.payload;
    });
    builder.addCase(fetchExpoPushToken.rejected, (state, action) => {
      state.error = action.payload as Error;
    });
  },
});

export const { setNotification, setError } = notificationsSlice.actions;

export default notificationsSlice.reducer;
