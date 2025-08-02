import { v4 as uuidv4 } from "uuid";
import { memo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { sendMessage } from "@/store/active-chat/active-chat-slice";
import { cn } from "@/lib/utils";
import { Mic, Plus, Send } from "lucide-react";
import type { IMessage } from "@/types/api-response.type";

export const ChatInput = memo(function ChatInput() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const [messageText, setMessageText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    if (!user) return;

    const dataForAppeadState: IMessage = {
      _id: uuidv4(),
      content: messageText,
      type: "text",
      createdAt: new Date().toUTCString(),
      sender: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
      },
    };

    const { ...rest } = dataForAppeadState;
    dispatch(sendMessage(rest));
    setMessageText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleRecording = () => {};

  return (
    <div className="relative flex items-center bg-white rounded-full p-1">
      <InputButton onClick={() => {}} type="button">
        <Plus size={24} />
      </InputButton>
      <InputButton onClick={() => {}} type="button">
        <EmojiIcon />
      </InputButton>

      <form onSubmit={handleSubmit} className="flex-1 flex gap-2 items-center">
        <textarea
          className={cn("flex-1 outline-none p-2")}
          name="message"
          id="message"
          rows={1}
          cols={3}
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <InputButton type="submit">
          <Send size={20} />
        </InputButton>
        <InputButton onClick={handleRecording} type="button">
          <Mic size={20} />
        </InputButton>
      </form>
    </div>
  );
});

const InputButton = ({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  type: "submit" | "button";
}) => {
  return (
    <button
      className="size-10  rounded-full hover:bg-accent flex items-center justify-center cursor-pointer transition-all duration-300"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const EmojiIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      height="24"
      width="24"
      preserveAspectRatio="xMidYMid meet"
      className="size-"
      fill="none"
    >
      <title>expressions</title>
      <path
        d="M8.49893 10.2521C9.32736 10.2521 9.99893 9.5805 9.99893 8.75208C9.99893 7.92365 9.32736 7.25208 8.49893 7.25208C7.6705 7.25208 6.99893 7.92365 6.99893 8.75208C6.99893 9.5805 7.6705 10.2521 8.49893 10.2521Z"
        fill="currentColor"
      ></path>
      <path
        d="M17.0011 8.75208C17.0011 9.5805 16.3295 10.2521 15.5011 10.2521C14.6726 10.2521 14.0011 9.5805 14.0011 8.75208C14.0011 7.92365 14.6726 7.25208 15.5011 7.25208C16.3295 7.25208 17.0011 7.92365 17.0011 8.75208Z"
        fill="currentColor"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.8221 19.9799C15.5379 21.2537 13.8087 21.9781 12 22H9.27273C5.25611 22 2 18.7439 2 14.7273V9.27273C2 5.25611 5.25611 2 9.27273 2H14.7273C18.7439 2 22 5.25611 22 9.27273V11.8141C22 13.7532 21.2256 15.612 19.8489 16.9776L16.8221 19.9799ZM14.7273 4H9.27273C6.36068 4 4 6.36068 4 9.27273V14.7273C4 17.6393 6.36068 20 9.27273 20H11.3331C11.722 19.8971 12.0081 19.5417 12.0058 19.1204L11.9935 16.8564C11.9933 16.8201 11.9935 16.784 11.9941 16.7479C11.0454 16.7473 10.159 16.514 9.33502 16.0479C8.51002 15.5812 7.84752 14.9479 7.34752 14.1479C7.24752 13.9479 7.25585 13.7479 7.37252 13.5479C7.48919 13.3479 7.66419 13.2479 7.89752 13.2479L13.5939 13.2479C14.4494 12.481 15.5811 12.016 16.8216 12.0208L19.0806 12.0296C19.5817 12.0315 19.9889 11.6259 19.9889 11.1248V9.07648H19.9964C19.8932 6.25535 17.5736 4 14.7273 4ZM14.0057 19.1095C14.0066 19.2605 13.9959 19.4089 13.9744 19.5537C14.5044 19.3124 14.9926 18.9776 15.4136 18.5599L18.4405 15.5576C18.8989 15.1029 19.2653 14.5726 19.5274 13.996C19.3793 14.0187 19.2275 14.0301 19.0729 14.0295L16.8138 14.0208C15.252 14.0147 13.985 15.2837 13.9935 16.8455L14.0057 19.1095Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
