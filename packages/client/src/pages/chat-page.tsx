import { useParams } from "react-router-dom";
import { useActiveChatSetUp } from "@/hooks/use-active-chat";
import { ChatMessages } from "@/components/chats/chat-messages";
import { ChatInput } from "@/components/chats/chat-input";

const Chat = () => {
  const { chatId } = useParams();

  useActiveChatSetUp(chatId as string);

  return (
    <div className="w-full h-[calc(100vh-64px)] p-2 flex flex-col relative overflow-hidden">
      <ChatMessages />

      <ChatInput />
    </div>
  );
};

export default Chat;
