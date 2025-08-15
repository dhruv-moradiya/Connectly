import { createContext, useState } from "react";
import type { IMessage } from "@/types/api-response.type";
import type { ReactNode } from "react";

enum InteractionMode {
  NONE = "none",
  DELETE = "delete",
  REPLY = "reply",
  PIN = "pin",
  drag = "drag",
}

interface ChatMessageContextType {
  selectedMessage: IMessage[];
  interactionMode: InteractionMode;

  setSelectedMessage: React.Dispatch<React.SetStateAction<IMessage[]>>;
  setInteractionMode: React.Dispatch<React.SetStateAction<InteractionMode>>;
}

const ChatMessageContext = createContext<ChatMessageContextType | null>(null);

const ChatMessageProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMessage, setSelectedMessage] = useState<IMessage[]>([]);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>(
    InteractionMode.NONE
  );

  const value = {
    selectedMessage,
    setSelectedMessage,
    interactionMode,
    setInteractionMode,
  };

  return (
    <ChatMessageContext.Provider value={value}>
      {children}
    </ChatMessageContext.Provider>
  );
};

export { ChatMessageContext, ChatMessageProvider };
