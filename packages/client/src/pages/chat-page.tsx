import { useParams } from "react-router-dom";
import { useActiveChatSetUp } from "@/hooks/use-active-chat";
import { ChatMessages } from "@/components/chats/chat-messages";
import { ChatInput } from "@/components/chats/chat-input";
import { useAppSelector } from "@/store/store";
import AppIcon from "@/components/common/app-icon";

const Chat = () => {
  const { chatId } = useParams();
  const isLoading = useAppSelector(
    (state) => state.activeChat.fetchingInitialData
  );

  useActiveChatSetUp(chatId as string);

  return (
    <div className="w-full h-[calc(100vh-64px)] p-2 flex flex-col relative overflow-hidden">
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <AppIcon />
        </div>
      )}
      {!isLoading && (
        <>
          <ChatMessages />
          <ChatInput />
        </>
      )}
    </div>
  );
};

export default Chat;
