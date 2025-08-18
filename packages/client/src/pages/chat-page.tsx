import { useParams } from "react-router-dom";
import { useAppSelector } from "@/store/store";

import AppIcon from "@/components/common/app-icon";
import ChatInput from "@/components/chats/chat-input";
import ChatMessages from "@/components/chats/chat-messages";
import { ChatMessageProvider } from "@/lib/chat-message-context";

import { useActiveChatSetUp } from "@/hooks/use-active-chat";

const Chat = () => {
  const { chatId } = useParams();

  const isLoading = useAppSelector(
    (state) => state.activeChat.fetchingInitialData
  );

  useActiveChatSetUp(chatId as string);

  return (
    <div className="w-full h-[calc(100vh-64px)] p-2 flex flex-col relative overflow-x-hidden">
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <AppIcon />
        </div>
      )}
      {!isLoading && (
        <ChatMessageProvider>
          <ChatMessages />

          <ChatInput />
        </ChatMessageProvider>
      )}
    </div>
  );
};

export default Chat;
