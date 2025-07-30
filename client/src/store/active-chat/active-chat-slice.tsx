import { getActiveChatMessages } from "@/api";
import type { IMessages } from "@/types/api-response.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IActiveChatType {
  messages: IMessages[];
}

const initialState: IActiveChatType = {
  messages: [],
};

const activeChatSlice = createSlice({
  name: "activeChat",
  initialState,
  reducers: {
    sendMessage(state, action) {},
  },

  extraReducers: (builder) => {
    builder.addCase(getActiveChatMessagesThunk.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
  },
});

export const getActiveChatMessagesThunk = createAsyncThunk(
  "activeChat/getActiveChatMessagesThunk",
  async ({ chatId }: { chatId: string }) => {
    const response = await getActiveChatMessages(chatId);
    const data = response.data;
    return data;
  }
);

export const activeChatReducer = activeChatSlice.reducer;
export const { sendMessage } = activeChatSlice.actions;
