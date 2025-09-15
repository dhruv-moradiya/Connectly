import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useChatMessage } from "@/hooks/use-chat-message";
import { showToast } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Check, CheckCheck, Clock, Eye } from "lucide-react";
import { InteractionMode } from "@/types/index.type";
import {
  Reply,
  Copy,
  Smile,
  Forward,
  Pin,
  Star,
  Trash,
  MoreVertical,
  Info,
} from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { IMessage } from "@/types/api-response.type";
import { format } from "date-fns";

const DEFAULT_AVATAR =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROwEIMOLfVpbKfw9EYVreHkPB4FAmFJ7DYow&s";

const message12 = {
  content: "Hey! Are we meeting today at 5 PM?",
  createdAt: "2025-09-06T12:30:00Z",
  sender: {
    username: "John Doe",
    avatar: DEFAULT_AVATAR,
  },
  seenBy: [
    {
      _id: "1",
      username: "Alice",
      avatar: DEFAULT_AVATAR,
      seenAt: "9/6/2025, 6:00:00 PM",
    },
    {
      _id: "2",
      username: "Bob",
      avatar: DEFAULT_AVATAR,
      seenAt: "9/6/2025, 6:00:00 PM",
    },
    {
      _id: "3",
      username: "Charlie",
      avatar: DEFAULT_AVATAR,
      seenAt: "9/6/2025, 6:00:00 PM",
    },
  ],
};

type DeliveryStatus = "pending" | "sent" | "delivered" | "seen";

function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
  const getBadge = () => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-transparent text-muted-foreground border-dashed"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="secondary" className="bg-transparent text-primary">
            <Check className="w-3 h-3 mr-1" />
            Sent
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            variant="secondary"
            className="bg-transparent text-green-600 dark:text-green-400"
          >
            <CheckCheck className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        );
      case "seen":
        return (
          <Badge
            variant="secondary"
            className="bg-transparent text-purple-600 dark:text-purple-400"
          >
            <Eye className="w-3 h-3 mr-1" />
            Seen
          </Badge>
        );
    }
  };

  return getBadge();
}

interface ChatBubbleMenuProps {
  message: IMessage;
  setShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
  chatBubbleMenuRef: React.RefObject<HTMLDivElement | null>;
}

const ChatBubbleMenu = ({
  message,
  setShowPopover,
  chatBubbleMenuRef,
}: ChatBubbleMenuProps) => {
  const { setInteractionMode, setSelectedMessage } = useChatMessage();

  const [showInfo, setShowInfo] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-white/10 focus:outline-none">
          <MoreVertical size={16} className="text-white" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent ref={chatBubbleMenuRef} align="start">
        {/* Reply */}
        <DropdownMenuItem
          className="gap-2"
          onClick={() => {
            setInteractionMode(InteractionMode.REPLY);
            setSelectedMessage([message!]);
          }}
        >
          <Reply className="w-4 h-4 text-gray-500" />
          Reply
        </DropdownMenuItem>

        {/* Copy */}
        <DropdownMenuItem
          className="gap-2"
          onClick={() => {
            navigator.clipboard.writeText(message?.content || "");
            showToast("Copied", "", "success");
          }}
        >
          <Copy className="w-4 h-4 text-gray-500" />
          Copy
        </DropdownMenuItem>

        {/* React */}
        <DropdownMenuItem
          className="gap-2"
          onClick={() => {
            setInteractionMode(InteractionMode.REACT);
            setSelectedMessage([message!]);
            setShowPopover(true);
          }}
        >
          <Smile className="w-4 h-4 text-gray-500" />
          React
        </DropdownMenuItem>

        {/* Other options */}
        <DropdownMenuItem className="gap-2">
          <Forward className="w-4 h-4 text-gray-500" />
          Forward
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Pin className="w-4 h-4 text-gray-500" />
          Pin
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Star className="w-4 h-4 text-gray-500" />
          Star
        </DropdownMenuItem>

        {/* Info → opens popover */}
        <DropdownMenuItem
          className="gap-2"
          onClick={(e) => {
            e.preventDefault();
            setShowInfo(true);
          }}
        >
          <Info className="w-4 h-4 text-gray-500" />
          Info
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        {/* Delete */}
        <DropdownMenuItem className="group gap-2 dark:hover:bg-red-800/20 hover:bg-red-500/10!">
          <Trash className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* Info Popover */}

      <Sheet open={showInfo} onOpenChange={setShowInfo}>
        <SheetContent side="bottom" className="p-6 rounded-t-xl">
          <SheetHeader className="p-0">
            <SheetTitle className="text-lg font-semibold">
              Message Info
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground mt-1">
              Details about this message
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-3">
            {/* Sender Info */}
            <div className="flex items-center gap-3">
              <img
                src={message.sender.avatar}
                alt={message.sender.username}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{message.sender.username}</p>
                <p className="text-sm text-muted-foreground">Sender</p>
              </div>
            </div>

            {/* Message12 Content */}
            <div className="border p-2 rounded-lg text-sm break-words">
              {message.content}
            </div>

            {/* Message12 Details */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Sent at: </span>
                {format(message.createdAt, "M/d/yyyy, h:mm:ss a")}
              </p>
              <div>
                <span className="font-medium">Status: </span>
                <DeliveryStatusBadge status={message.deliveryStatus} />
              </div>
            </div>

            {/* Seen by users */}
            {message.seenBy.length > 0 && (
              <div className="mt-2">
                <p className="font-medium text-sm mb-2">Seen by:</p>
                <div className="flex overflow-x-auto gap-3">
                  {message.seenBy.map((user) => (
                    <div
                      key={user._id}
                      className="flex flex-col items-center min-w-[70px]"
                    >
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="h-10 w-10 rounded-full object-cover border-2 border-primary"
                      />
                      <p className="text-xs text-center mt-1 truncate w-full">
                        {user.username}
                      </p>
                      <p className="text-[10px] text-center text-muted-foreground mt-0.5">
                        {user.seenAt
                          ? format(user.seenAt, "dd-mm-yyyy hh:mm aa")
                          : "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </DropdownMenu>
  );
};

export default ChatBubbleMenu;
