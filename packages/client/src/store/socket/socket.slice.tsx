import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { format } from "date-fns";

interface SocketState {
  isConnected: boolean;
  lastAttempt: string | null;
  noOfAttempts: number;
  error: string | null;
  connectionHistory: {
    timestamp: string;
    status: "connected" | "disconnected" | "error" | "reconnected";
    error?: string;
  }[];
}

const initialState: SocketState = {
  isConnected: false,
  lastAttempt: null,
  noOfAttempts: 0,
  error: null,
  connectionHistory: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    createConnection: (state) => {
      state.lastAttempt = format(new Date(), "dd-MMM-yyyy HH:mm:ss");
      state.isConnected = true;
      state.noOfAttempts = 1;
      state.connectionHistory.push({
        timestamp: state.lastAttempt,
        status: "connected",
      });
    },
    disconnectConnection: (state) => {
      state.isConnected = false;
      state.lastAttempt = format(new Date(), "dd-MMM-yyyy HH:mm:ss");
      state.connectionHistory.push({
        timestamp: format(new Date(), "dd-MMM-yyyy HH:mm:ss"),
        status: "disconnected",
      });
    },
    connectionError: (state, action) => {
      state.error = action.payload;
      state.isConnected = false;
      state.lastAttempt = format(new Date(), "dd-MMM-yyyy HH:mm:ss");
      state.connectionHistory.push({
        timestamp: format(new Date(), "dd-MMM-yyyy HH:mm:ss"),
        status: "error",
        error: action.payload,
      });
    },
    reaconnectedConnection: (state, action: PayloadAction<number>) => {
      state.isConnected = true;
      state.noOfAttempts = action.payload;
      state.error = null;
      state.lastAttempt = format(new Date(), "dd-MMM-yyyy HH:mm:ss");
      state.connectionHistory.push({
        timestamp: state.lastAttempt,
        status: "reconnected",
      });
    },
  },
});

export const {
  createConnection,
  disconnectConnection,
  connectionError,
  reaconnectedConnection,
} = socketSlice.actions;
export const socketReducer = socketSlice.reducer;
