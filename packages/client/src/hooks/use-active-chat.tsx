import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  clearActiveChat,
  getActiveChatMessagesThunk,
  setActiveChat,
} from "@/store/active-chat/active-chat-slice";
import { useEffect } from "react";

const useActiveChatSetUp = (chatId: string) => {
  const dispatch = useAppDispatch();
  const { isConnected } = useAppSelector((state) => state.socket);

  useEffect(() => {
    if (isConnected) dispatch(setActiveChat(chatId));

    dispatch(
      getActiveChatMessagesThunk({
        chatId: chatId,
        page: 1,
        limit: 40,
      })
    );

    return () => {
      dispatch(clearActiveChat(chatId));
    };
  }, [chatId, dispatch, isConnected]);
};

export { useActiveChatSetUp };
