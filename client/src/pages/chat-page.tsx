import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ChatBubble from "@/components/chats/chat-bubble";

// Generate 50 mock messages

const Chat = () => {
  const chatContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] p-2 flex flex-col relative overflow-hidden">
      <div
        ref={chatContainer}
        className="p-2 flex-1 overflow-y-auto space-y-2 flex flex-col gap-0.5 chatDiv"
      >
        <ChatBubble isSender={true} />
        <ChatBubble isSender={false} />
        <ChatBubble isSender={true} />
        <ChatBubble isSender={false} />
        <ChatBubble isSender={false} />
        <ChatBubble isSender={true} />
        <ChatBubble isSender={false} />
        <ChatBubble isSender={false} />
        <ChatBubble isSender={true} />
        <ChatBubble isSender={false} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-start gap-2 mt-2">
        <Textarea
          className="flex-1 resize-none"
          name="message"
          id="message"
          rows={1}
          placeholder="Type a message..."
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

export default Chat;
