import { configureStore, type Middleware } from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";

import authReducer from "./auth/auth-slice";
import userChatsReducer from "./chats/user-chats-slice";
import { socketReducer } from "./socket/socket.slice";
import { socketMiddleware } from "./socket/socket.middleware";

const customMiddleware: Middleware = () => (next) => (action) => {
  return next(action);
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    userChats: userChatsReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(customMiddleware).concat(socketMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
