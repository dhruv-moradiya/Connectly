import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  UserPlus2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAppSelector } from "@/store/store";
import { cn, getHeaderImage, getHeaderName } from "@/lib/utils";

import { useState } from "react";
import CommonTooltip from "../common/common-tooltip";
import AnimatedCheck from "../common/animated-check";

const ChatHeader = ({ isGroupChat }: { isGroupChat: boolean }) => {
  const { setQuery, query, setIsSidebarOpen } = useChatMessage();

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
              <DropdownMenuItem onClick={() => setIsSidebarOpen(true)}>
                <Info />
                {isGroupChat ? "Group info" : "Contact info"}
              </DropdownMenuItem>
              <AddOtherParticipantsDialog />
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

export function AddOtherParticipantsDialog() {
  const [query, setQuery] = useState("");
  const [selected, _setSelected] = useState<any[]>([]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <UserPlus2 className="mr-2 h-4 w-4" />
          Add other participants
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl min-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add other participants
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Search and add participants by their{" "}
            <span className="font-medium">username</span>
            or <span className="font-medium">user ID</span>, <br />
            or simply select from the list below.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Enter username or ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-2"
        />

        <div className="grid grid-cols-12 gap-2">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className={cn(
                "col-span-3 flex items-center gap-3 p-2 rounded-md border cursor-pointer transition-all duration-150",
                selected ? "bg-primary/10 border-primary" : "hover:bg-muted"
              )}
            >
              <img
                src={
                  "https://i.pinimg.com/736x/0a/30/75/0a3075f110d1ab19e31bcaa051bf0e7a.jpg"
                }
                alt={""}
                className="shrink-0 w-10 h-10 rounded-full object-cover"
              />

              <div className="flex-1">
                <CommonTooltip title={"user.username"}>
                  <p className="w-fit text-sm font-medium line-clamp-1">
                    {"user.username"}
                  </p>
                </CommonTooltip>
                <p className="text-xs text-muted-foreground">
                  {"user.username"}
                </p>
              </div>

              <AnimatedCheck selected={true} />
            </div>
          ))}
        </div>

        {/* Confirm Button */}
        {selected.length > 0 && (
          <Button className="w-full mt-4 rounded-xl">
            Add {selected.length} Participant
            {selected.length > 1 ? "s" : ""}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
