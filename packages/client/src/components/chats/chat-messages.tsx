import { useAppSelector } from "@/store/store";
import { useEffect, useRef } from "react";
import ChatBubble from "./chat-bubble/chat-bubble";

const ChatMessages = () => {
  const chatContainer = useRef<HTMLDivElement>(null);

  const { messages } = useAppSelector((state) => state.activeChat);
  const user = useAppSelector((state) => state.auth.user);

  console.log("messages :>> ", messages);

  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={chatContainer}
      className="p-2 flex-1 overflow-y-scroll space-y-2 flex flex-col gap-0.5 chatDiv"
    >
      {messages.map((message) => (
        <ChatBubble
          key={message._id}
          isSender={message.sender._id === user?._id}
          content={message.content}
          deliveryStatus={message.deliveryStatus}
        />
      ))}
    </div>
  );
};
export { ChatMessages };
