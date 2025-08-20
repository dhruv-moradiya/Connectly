import { getUserChats } from "@/api";
import type { IChatPreview, IUserChats } from "@/types/api-response.type";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface IUserChatsState {
  chats: IChatPreview[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IUserChatsState = {
  chats: [],
  isLoading: false,
  error: null,
};

const userChatsSlice = createSlice({
  name: "userChats",
  initialState,
  reducers: {
    chatCreatedReducer: (state, action: PayloadAction<IChatPreview>) => {
      state.chats = [...state.chats, action.payload];
    },

    updateLastMessageReducer: (
      state,
      action: PayloadAction<{
        _id: string;
        content: string;
        chatId: string;
      }>
    ) => {
      state.chats = state.chats.map((chat) => {
        if (chat._id === action.payload.chatId) {
          return {
            ...chat,
            lastMessage: {
              ...chat.lastMessage,
              content: action.payload.content,
              chatId: action.payload.chatId,
              _id: action.payload._id,
            },
          };
        }
        return chat;
      });
    },
  },
  extraReducers(builder) {
    builder.addCase(getUserChatsThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserChatsThunk.fulfilled, (state, action) => {
      state.chats = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getUserChatsThunk.rejected, (state, action) => {
      const error = (action.payload as string) || "Something went wrong";
      state.isLoading = false;
      state.error = error;
    });
  },
});

const getUserChatsThunk = createAsyncThunk(
  "userChats/getUserChats",
  async (_, { rejectWithValue }) => {
    try {
      const response: IUserChats = await getUserChats();
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

const userChatsReducer = userChatsSlice.reducer;
export const { chatCreatedReducer, updateLastMessageReducer } =
  userChatsSlice.actions;
export { getUserChatsThunk };
export default userChatsReducer;
