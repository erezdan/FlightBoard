// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import flightsUiReducer from "../features/flights/flightsUiSlice";

export const store = configureStore({
  reducer: {
    flightsUi: flightsUiReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
