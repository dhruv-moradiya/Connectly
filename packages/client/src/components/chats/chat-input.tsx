import { v4 as uuidv4 } from "uuid";
import { memo, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { sendMessage } from "@/store/active-chat/active-chat-slice";
import { cn, getSenderName, isCurrentUser } from "@/lib/utils";
import { Plus, Send, Smile, X } from "lucide-react";
import type { IMessage } from "@/types/api-response.type";
import { usePanelExpand } from "@/hooks/use-panel-expand";
import { useChatMessage } from "@/hooks/use-chat-message";
import { InteractionMode } from "@/types/index.type";
import { Button } from "@/components/ui/button";

/* -------------------- Main Chat Input -------------------- */
const ChatInput = memo(function ChatInput() {
  const dispatch = useAppDispatch();
  const panelRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth.user);

  const [messageText, setMessageText] = useState("");
  const { selectedMessage, interactionMode } = useChatMessage();
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

  useEffect(() => {
    if (
      selectedMessage.length > 0 &&
      interactionMode === InteractionMode.REPLY
    ) {
      openPanel();
    }
  }, [selectedMessage, interactionMode]);

  return (
    <div className="relative flex flex-col items-center bg-white rounded-md p-1">
      <div
        ref={panelRef}
        className={cn(
          "w-full pl-4 overflow-hidden flex items-center justify-between border-l-4 rounded-md",
          isCurrentUser(selectedMessage[0], user)
            ? "border-primary"
            : "border-zinc-600"
        )}
      >
        <div className="flex flex-col gap-1">
          <p
            className={cn(
              "text-start text-sm font-semibold",
              isCurrentUser(selectedMessage[0], user)
                ? "text-primary"
                : "text-zinc-600"
            )}
          >
            {getSenderName(selectedMessage[0], user)}
          </p>
          <p className="text-start text-sm line-clamp-2">
            {selectedMessage.length ? selectedMessage[0].content : ""}
          </p>
        </div>
        <Button size={"sm"} variant={"ghost"} onClick={closePanel}>
          <X size={16} />
        </Button>
      </div>

      <div className="w-full flex items-center gap-1">
        <InputButton icon={<Plus size={20} />} />
        <InputButton icon={<Smile size={20} />} />

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
          {/* <InputButton icon={<Mic size={20} />} onClick={() => {}} /> */}
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
    className="size-8 rounded-full hover:bg-accent flex items-center justify-center transition-all duration-300"
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
