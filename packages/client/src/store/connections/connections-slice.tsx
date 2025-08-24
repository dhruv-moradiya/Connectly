import { getConnections } from "@/api";
import type { IConnections, IUserPreview } from "@/types/api-response.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface ConnectionsState {
  isLoading: boolean;
  error: string;
  connections: IUserPreview[];
  totalConnections: number;
}

const initialState: ConnectionsState = {
  isLoading: false,
  error: "",
  connections: [],
  totalConnections: 0,
};

const connectionsSlice = createSlice({
  name: "connections",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getConnectionThunk.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(getConnectionThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.connections = action.payload.connections;
      state.totalConnections = action.payload.connections.length;
    });
    builder.addCase(getConnectionThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

const getConnectionThunk = createAsyncThunk(
  "connections/fetchConnections",
  async (_, { rejectWithValue }) => {
    try {
      const response: IConnections = await getConnections();
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message);
      } else {
        return rejectWithValue("An unknown error occurred.");
      }
    }
  }
);

const connectionsReducer = connectionsSlice.reducer;
export { connectionsReducer, getConnectionThunk };
