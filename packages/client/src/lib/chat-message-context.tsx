import { createContext, useState } from "react";
import type { IMessage } from "@/types/api-response.type";
import type { ReactNode } from "react";
import { InteractionMode } from "@/types/index.type";

interface ChatMessageContextType {
  selectedMessage: IMessage[];
  interactionMode: InteractionMode;
  query: string;

  setSelectedMessage: React.Dispatch<React.SetStateAction<IMessage[]>>;
  setInteractionMode: React.Dispatch<React.SetStateAction<InteractionMode>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;

  handleQuerySearch: (text: string) => ReactNode;
}

const ChatMessageContext = createContext<ChatMessageContextType | null>(null);

const ChatMessageProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMessage, setSelectedMessage] = useState<IMessage[]>([]);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>(
    InteractionMode.NONE
  );
  const [query, setQuery] = useState<string>("");

  const handleQuerySearch = (text: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");

    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const value = {
    selectedMessage,
    setSelectedMessage,
    interactionMode,
    setInteractionMode,
    query,
    setQuery,
    handleQuerySearch,
  };

  return (
    <ChatMessageContext.Provider value={value}>
      {children}
    </ChatMessageContext.Provider>
  );
};

export { ChatMessageContext, ChatMessageProvider };
