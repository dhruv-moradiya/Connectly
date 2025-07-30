import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ChatBubble from "@/components/chats/chat-bubble/chat-bubble";
import { Pin, Smile } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useParams } from "react-router-dom";
import {
  getActiveChatMessagesThunk,
  sendMessage,
} from "@/store/active-chat/active-chat-slice";

const Chat = () => {
  const dispatch = useAppDispatch();

  const { chatId } = useParams();
  const chatContainer = useRef<HTMLDivElement>(null);

  const { user } = useAppSelector((state) => state.auth);
  const { messages } = useAppSelector((state) => state.activeChat);
  console.log("messages :>> ", messages);

  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    dispatch(getActiveChatMessagesThunk({ chatId: chatId as string }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      content: `${messageText}`,
      chatId,
      _id: uuidv4(),
    };
    dispatch(sendMessage(data));
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] p-2 flex flex-col relative overflow-hidden">
      <div
        ref={chatContainer}
        className="p-2 flex-1 overflow-hidden space-y-2 flex flex-col gap-0.5 chatDiv"
      >
        {/* {Array.from({ length: 10 }).map((_, index) => (
          <ChatBubble key={index} isSender={index % 2 === 0} />
        ))} */}

        {messages?.map((message) => (
          <ChatBubble
            key={message._id}
            isSender={message.sender._id === user?._id}
            content={message.content}
          />
        ))}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900">
        <div className="flex items-end gap-2">
          {/* Pin Button */}
          <div className="relative group">
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:text-primary transition"
              type="button"
            >
              <Pin className="w-5 h-5" />
            </Button>
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              Attach
            </div>
          </div>

          {/* Emoji Button */}
          <div className="relative group">
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:text-primary transition"
              type="button"
            >
              <Smile className="w-5 h-5" />
            </Button>
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              Emoji
            </div>
          </div>

          {/* Message Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex gap-2 items-end">
            <Textarea
              className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-800 dark:text-white"
              name="message"
              id="message"
              rows={1}
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90 rounded-lg px-4 py-2 shadow"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
