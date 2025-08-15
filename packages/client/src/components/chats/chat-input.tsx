import { v4 as uuidv4 } from "uuid";
import { memo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { sendMessage } from "@/store/active-chat/active-chat-slice";
import { cn } from "@/lib/utils";
import { CheckCircle, Mic, Plus, Send } from "lucide-react";
import type { IMessage } from "@/types/api-response.type";
import EmojiIcon from "@/components/common/emoji-icon";
import { usePanelExpand } from "@/hooks/use-panel-expand";

/* -------------------- Main Chat Input -------------------- */
const ChatInput = memo(function ChatInput() {
  const dispatch = useAppDispatch();
  const panelRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector((state) => state.auth.user);

  const [messageText, setMessageText] = useState("");

  const { closePanel, openPanel } = usePanelExpand({
    panelRef: panelRef as React.RefObject<HTMLElement>,
  });

  const handleSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !user) return;

    const newMessage: IMessage = {
      _id: uuidv4(),
      content: messageText,
      type: "text",
      createdAt: new Date().toUTCString(),
      deliveryStatus: "pending",
      sender: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
      },
    };

    dispatch(sendMessage(newMessage));
    setMessageText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative flex flex-col items-center bg-white rounded-md p-1">
      <div ref={panelRef} style={{ overflow: "hidden" }}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
          inventore saepe, repellat eos aspernatur quidem incidunt amet. Cum
          pariatur facere suscipit aliquam eveniet debitis! Id quas iste nam
          sunt numquam.
        </p>
        <button onClick={closePanel}>Reply</button>
      </div>
      <div className="w-full flex items-center">
        <InputButton icon={<Plus size={24} />} />
        <InputButton icon={<EmojiIcon />} />
        <InputButton icon={<CheckCircle size={24} />} onClick={openPanel} />

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex gap-2 items-center"
        >
          <MessageTextarea
            value={messageText}
            onChange={setMessageText}
            onKeyDown={handleKeyDown}
          />

          <InputButton type="submit" icon={<Send size={20} />} />
          <InputButton icon={<Mic size={20} />} onClick={() => {}} />
        </form>
      </div>
    </div>
  );
});

/* -------------------- Reusable Sub Components -------------------- */
type InputButtonProps = {
  onClick?: () => void;
  icon: React.ReactNode;
  type?: "submit" | "button";
};

const InputButton = ({ onClick, icon, type = "button" }: InputButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    className="size-10 rounded-full hover:bg-accent flex items-center justify-center transition-all duration-300"
  >
    {icon}
  </button>
);

type MessageTextareaProps = {
  value: string;
  onChange: (val: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

const MessageTextarea = ({
  value,
  onChange,
  onKeyDown,
}: MessageTextareaProps) => (
  <textarea
    className={cn("flex-1 outline-none p-2 resize-none")}
    name="message"
    id="message"
    rows={1}
    placeholder="Type a message..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
  />
);

export default ChatInput;
