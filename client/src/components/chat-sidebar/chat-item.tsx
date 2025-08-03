import { cn, getChatDisplayMeta } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IChatPreview } from "@/types/api-response.type";
import { useAppSelector } from "@/store/store";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  ChevronDown,
  BellOff,
  Mail,
  Pin,
  Star,
  Trash2,
  Ban,
} from "lucide-react";
import { useState } from "react";

type ChatItemProps = {
  chat: IChatPreview;
};

export default function ChatItem({ chat }: ChatItemProps) {
  const { chatId } = useParams();
  const currentUser = useAppSelector((state) => state.auth.user);

  if (!currentUser) return null;

  const { displayName, avatarUrl, fallback } = getChatDisplayMeta(
    chat,
    currentUser._id
  );
  const lastMessage =
    "Placeholder for last message, can be replaced with actual data";
  const isActive = chatId === chat._id;

  return (
    <Link
      to={`/chat/${chat._id}`}
      id={chat._id}
      className={cn(
        "relative group/chat w-full flex justify-between gap-2 p-4 items-center text-sm leading-tight whitespace-nowrap last:border-b-0 transition-colors",
        "text-sidebar-foreground border-sidebar-border",
        "hover:bg-sidebar-hover hover:text-sidebar-hover-foreground",
        "focus:bg-sidebar-focus focus:text-sidebar-focus-foreground",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
      )}
    >
      <Avatar className="size-10 rounded-lg">
        <AvatarImage
          src={avatarUrl}
          alt={displayName}
          className="object-cover"
        />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center justify-between w-full">
          <span className="font-medium">{displayName}</span>
          <span className="text-xs text-gray-400">12:34 PM</span>
        </div>
        <div className="text-gray-500 text-xs line-clamp-1 w-full whitespace-break-spaces">
          <span>{lastMessage}</span>
        </div>
      </div>

      <ChatMenu />
    </Link>
  );
}

const ChatMenu = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute right-0 top-8 z-10 overflow-hidden">
      <div
        className={cn(
          "group/menu relative translate-x-4 opacity-0 group-hover/chat:translate-x-0 group-hover/chat:opacity-100 transition-all duration-300 ease-in-out",
          open ? "opacity-100 translate-x-0" : "opacity-0"
        )}
      >
        <Menubar
          className="border-none p-0 shadow-none bg-transparent"
          onValueChange={() => setOpen(false)}
        >
          <MenubarMenu>
            <MenubarTrigger
              className="cursor-pointer bg-transparent hover:bg-transparent p-1.5 rounded-md"
              onClick={(e) => {
                e.preventDefault();
                setOpen(!open);
              }}
            >
              <ChevronDown size={18} className="text-gray-400" />
            </MenubarTrigger>

            <MenubarContent
              align="end"
              className="min-w-[180px] p-1 mt-1 rounded-md bg-white dark:bg-muted animate-in fade-in zoom-in-95"
            >
              <MenubarItem className="gap-2">
                <BellOff className="w-4 h-4 text-gray-500" />
                Mute Notifications
              </MenubarItem>
              <MenubarItem className="gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                Mark as Unread
              </MenubarItem>
              <MenubarItem className="gap-2">
                <Pin className="w-4 h-4 text-gray-500" />
                Pin Chat
              </MenubarItem>
              <MenubarItem className="gap-2">
                <Star className="w-4 h-4 text-gray-500" />
                Add to Favorites
              </MenubarItem>

              <MenubarSeparator className="my-1 border-gray-200 dark:border-gray-700" />

              <MenubarItem className="gap-2 hover:!bg-red-100 hover:text-red-600 group/icon">
                <Trash2 className="w-4 h-4 group-hover/icon:text-red-600" />
                Delete
              </MenubarItem>
              <MenubarItem className="gap-2 hover:!bg-red-100 hover:text-red-600 group/icon">
                <Ban className="w-4 h-4 group-hover/icon:text-red-600" />
                Block
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};
