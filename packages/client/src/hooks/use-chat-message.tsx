import { ChatMessageContext } from "@/lib/chat-message-context";
import { useContext } from "react";

export const useChatMessage = () => {
  const context = useContext(ChatMessageContext);
  if (!context) {
    throw new Error("useChatMessage must be used within a ChatMessageProvider");
  }
  return context;
};
