import { createContext, useState, useMemo } from "react";
import type { IMessage } from "@/types/api-response.type";
import type { ReactNode } from "react";

interface ChatMessageContextType {
  selectedMessage: IMessage[];
  setSelectedMessage: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

enum InteractionMode {
  NONE = "none",
  DELETE = "delete",
  REPLY = "reply",
  PIN = "pin",
  drag = "drag",
}

const ChatMessageContext = createContext<ChatMessageContextType | null>(null);

const ChatMessageProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMessage, setSelectedMessage] = useState<IMessage[]>([]);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>(
    InteractionMode.NONE
  );

  console.log("interactionMode :>> ", interactionMode);
  console.log("setInteractionMode :>> ", setInteractionMode);

  const value = useMemo(
    () => ({ selectedMessage, setSelectedMessage }),
    [selectedMessage]
  );

  return (
    <ChatMessageContext.Provider value={value}>
      {children}
    </ChatMessageContext.Provider>
  );
};

export { ChatMessageContext, ChatMessageProvider };
