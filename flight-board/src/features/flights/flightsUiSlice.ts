// src/features/flights/flightsUiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FlightsUiState {
  origin: string;
  destination: string;
  status: string;
}

const initialState: FlightsUiState = {
  origin: "",
  destination: "",
  status: ""
};

const flightsUiSlice = createSlice({
  name: "flightsUi",
  initialState,
  reducers: {
    setOrigin(state, action: PayloadAction<string>) {
      state.origin = action.payload;
    },
    setDestination(state, action: PayloadAction<string>) {
      state.destination = action.payload;
    },
    setStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    resetFilters(state) {
      state.origin = "";
      state.destination = "";
      state.status = "";
    }
  }
});

export const {
  setOrigin,
  setDestination,
  setStatus,
  resetFilters
} = flightsUiSlice.actions;

export default flightsUiSlice.reducer;
