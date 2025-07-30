import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Reply,
  Copy,
  Smile,
  Forward,
  Pin,
  Star,
  Trash,
  MoreVertical,
} from "lucide-react";

const ChatBubbleMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-white/10 focus:outline-none">
          <MoreVertical size={16} className="text-white" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        className="w-40 rounded-md bg-white dark:bg-muted p-1 animate-in fade-in zoom-in-95"
      >
        <DropdownMenuItem className="gap-2">
          <Reply className="w-4 h-4 text-gray-500" />
          Reply
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Copy className="w-4 h-4 text-gray-500" />
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Smile className="w-4 h-4 text-gray-500" />
          React
        </DropdownMenuItem>
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

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem className="gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
          <Trash className="w-4 h-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatBubbleMenu;
