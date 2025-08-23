import { AxiosError } from "axios";
import { getActiveChatMessages } from "@/api";
import type { IActiveChatMessages, IMessage } from "@/types/api-response.type";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface IActiveChatState {
  fetchingInitialData: boolean;
  chatId: string;
  messages: IMessage[];
  currentPage: number;
  totalPages: number;
  error: string | null;
}

const initialState: IActiveChatState = {
  fetchingInitialData: false,
  chatId: "",
  messages: [],
  currentPage: 1,
  totalPages: 1,
  error: null,
};

function updateMessageStatus(
  state: IActiveChatState, // replace with actual type
  action: PayloadAction<{ _id: string; status: "sent" | "delivered" | "seen" }>
) {
  state.messages = state.messages.map((message) =>
    message._id === action.payload._id
      ? { ...message, deliveryStatus: action.payload.status }
      : message
  );
}

/**
 * Thunk to fetch messages for active chat
 */
export const getActiveChatMessagesThunk = createAsyncThunk<
  { messages: IMessage[]; totalPages: number; currentPage: number },
  { chatId: string; page: number; limit: number },
  { rejectValue: string }
>(
  "activeChat/getMessages",
  async ({ chatId, page, limit }, { rejectWithValue }) => {
    try {
      const response: IActiveChatMessages = await getActiveChatMessages({
        chatId,
        page,
        limit,
      });
      return {
        ...response.data,
        currentPage: page,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message);
      } else {
        return rejectWithValue("An unknown error occurred.");
      }
    }
  }
);

const activeChatSlice = createSlice({
  name: "activeChat",
  initialState,
  reducers: {
    setActiveChat(state, action: PayloadAction<string>) {
      state.chatId = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clearActiveChat(state, _action: PayloadAction<string>) {
      state.chatId = "";
      state.messages = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.error = null;
    },
    sendMessage(state, action: PayloadAction<IMessage>) {
      state.messages = [...state.messages, action.payload];
    },

    // When we receive new message it will be added to the beginning of the list
    messageReceivedReducer(state, action: PayloadAction<IMessage>) {
      state.messages = [...state.messages, action.payload];
    },

    messageSentSuccess: (state, action: PayloadAction<{ _id: string }>) => {
      updateMessageStatus(state, {
        ...action,
        payload: { ...action.payload, status: "sent" },
      });
    },

    messageDeliveredSuccess: (
      state,
      action: PayloadAction<{ _id: string }>
    ) => {
      updateMessageStatus(state, {
        ...action,
        payload: { ...action.payload, status: "delivered" },
      });
    },

    messageSeenSuccess: (state, action: PayloadAction<{ _id: string }>) => {
      updateMessageStatus(state, {
        ...action,
        payload: { ...action.payload, status: "seen" },
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActiveChatMessagesThunk.pending, (state) => {
        state.fetchingInitialData = true;
        state.error = null;
      })
      .addCase(getActiveChatMessagesThunk.fulfilled, (state, action) => {
        state.fetchingInitialData = false;
        state.messages = action.payload.messages.reverse();
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getActiveChatMessagesThunk.rejected, (state, action) => {
        state.fetchingInitialData = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const {
  setActiveChat,
  clearActiveChat,
  sendMessage,
  messageReceivedReducer,
  messageSentSuccess,
  messageDeliveredSuccess,
  messageSeenSuccess,
} = activeChatSlice.actions;
export const activeChatReducer = activeChatSlice.reducer;
