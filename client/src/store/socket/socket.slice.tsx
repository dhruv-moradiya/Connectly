import { createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

interface SocketState {
  isConnected: boolean;
  lastAttempt: string | null;
  error: string | null;
  connectionHistory: {
    timestamp: string;
    status: "connected" | "disconnected" | "error";
    error?: string;
  }[];
}

const initialState: SocketState = {
  isConnected: false,
  lastAttempt: null,
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
  },
});

export const { createConnection, disconnectConnection, connectionError } =
  socketSlice.actions;
export const socketReducer = socketSlice.reducer;
