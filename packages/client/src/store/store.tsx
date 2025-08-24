// store.ts
import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

import authReducer from "./auth/auth-slice";
import userChatsReducer from "./chats/user-chats-slice";
import { socketReducer } from "./socket/socket.slice";
import { socketMiddleware } from "./socket/socket.middleware";
import { activeChatReducer } from "./active-chat/active-chat-slice";
import { connectionsReducer } from "./connections/connections-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    userChats: userChatsReducer,
    activeChat: activeChatReducer,
    connections: connectionsReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
