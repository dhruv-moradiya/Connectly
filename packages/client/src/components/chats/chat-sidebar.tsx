import { cn } from "@/lib/utils";
import { Image, Info, Users, X } from "lucide-react";
import { Button } from "../ui/button";
import { useChatMessage } from "@/hooks/use-chat-message";

const ChatSidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useChatMessage();
  return (
    <div
      className={cn(
        "border-l bg-background overflow-hidden flex flex-col transition-all duration-200",
        "col-span-12 w-0 p-0",
        isSidebarOpen && "md:col-span-3 md:w-full md:p-4"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Info size={20} /> Contact Info
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X />
        </Button>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center gap-2 py-4 border-b">
        <div className="size-28 rounded-full overflow-hidden shadow">
          <img
            src="https://res.cloudinary.com/dpji4qfnu/image/upload/v1756202079/connectly/groupChats/68ad845d3bf3420696eaaa5e/x0wk0t60edqqn5gqzziq.jpg"
            alt="Profile avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold">Group Name</h3>
        <p className="text-sm text-muted-foreground text-center px-2">
          This is the group description where users can write about the purpose
          of the group or rules.
        </p>
      </div>

      {/* Participants */}
      <div className="scrollbar py-4 border-b flex-1 overflow-y-auto">
        <h3 className="text-base font-medium flex items-center gap-2 mb-3">
          <Users size={18} /> Participants
        </h3>

        <div className="space-y-2">
          {[1, 2, 3, 4].map((_p, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition"
            >
              <div className="size-10 rounded-full overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dpji4qfnu/image/upload/v1756202079/connectly/groupChats/68ad845d3bf3420696eaaa5e/x0wk0t60edqqn5gqzziq.jpg"
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Username {idx + 1}</span>
                <span className="text-xs text-muted-foreground">
                  user{idx + 1}@example.com
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media */}
      <div className="py-4">
        <h3 className="text-base font-medium flex items-center gap-2 mb-2">
          <Image size={18} /> Media
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((_item, index) => (
            <div key={index} className="aspect-square">
              <div className="rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition">
                <img
                  src="https://res.cloudinary.com/dpji4qfnu/image/upload/v1756202079/connectly/groupChats/68ad845d3bf3420696eaaa5e/x0wk0t60edqqn5gqzziq.jpg"
                  alt="Media preview"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
