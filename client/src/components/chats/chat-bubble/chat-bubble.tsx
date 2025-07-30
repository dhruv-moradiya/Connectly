import DraggableBubble from "./draggable-bubble";

const ChatBubble = ({
  isSender,
  content,
}: {
  isSender: boolean;
  content: string;
}) => {
  return (
    <DraggableBubble isSender={isSender}>
      <div>{content}</div>
      <span className="text-[10px] text-muted ml-2 self-end">12:34 PM</span>
    </DraggableBubble>
  );
};

export default ChatBubble;
