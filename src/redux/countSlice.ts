import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CountState {
  value: number;
}

const initialState: CountState = {
  value: 0,
};

const countSlice = createSlice({
  name: "countRequests",
  initialState,
  reducers: {
    setCount: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setCount } = countSlice.actions;
export default countSlice.reducer;
