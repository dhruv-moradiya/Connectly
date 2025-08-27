import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatMessage } from "@/hooks/use-chat-message";
import {
  CircleMinus,
  CircleX,
  EllipsisVertical,
  Info,
  ListChecks,
  Phone,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAppSelector } from "@/store/store";
import { getHeaderImage, getHeaderName } from "@/lib/utils";

const ChatHeader = ({ isGroupChat }: { isGroupChat: boolean }) => {
  const { setQuery, query } = useChatMessage();

  const { chatId } = useAppSelector((state) => state.activeChat);
  const { user } = useAppSelector((state) => state.auth);
  const chatData = useAppSelector((state) =>
    state.userChats.chats.find((c) => c._id === chatId)
  );

  const headerImage = getHeaderImage(chatData, user);
  const headerName = getHeaderName(chatData, user);

  return (
    <div className="flex items-center justify-between shadow-xs py-1 px-2">
      <div className="flex gap-2 items-center">
        <div className="size-10 rounded-md overflow-hidden">
          <img
            src={headerImage ?? ""}
            alt="Image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-xs text-muted-foreground flex flex-col">
          <span>{headerName}</span>
          <span>Last seen at 12:40 pm</span>
        </div>
      </div>
      <div className="flex gap-1 items-center">
        <Input
          id="query"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant={"ghost"} size={"sm"}>
          <Phone />
        </Button>
        <Button variant={"ghost"} size={"sm"}>
          <Search />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"sm"}>
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Info />
                {isGroupChat ? "Group info" : "Contact info"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ListChecks />
                Select messages
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CircleX />
                Block
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CircleMinus />
                Clear chat
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="group gap-2 dark:hover:bg-red-800/20 hover:bg-red-500/10!">
                <Trash className="group-hover:text-red-500" /> Delete chat
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
