import { useAppDispatch } from "@/store";
import {
  clearActiveChat,
  getActiveChatMessagesThunk,
  setActiveChat,
} from "@/store/active-chat/active-chat-slice";
import { useEffect } from "react";

const useActiveChatSetUp = (chatId: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setActiveChat(chatId));
    dispatch(
      getActiveChatMessagesThunk({
        chatId: chatId,
        page: 1,
        limit: 10,
      })
    );

    return () => {
      dispatch(clearActiveChat(chatId));
    };
  }, [chatId, dispatch]);
};

export { useActiveChatSetUp };
