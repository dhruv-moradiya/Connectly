import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createNewChat, getUserByUsernameQuery } from "@/api";
import type { IUserPreview } from "@/types/api-response.type";
import { handleApiError } from "@/lib/handle-api-error";
import { showToast } from "@/lib/utils";

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUserPreview[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [creatingChat, setCreatingChat] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await getUserByUsernameQuery(query.trim().toLowerCase());
      setUsers(response.data || []);
    } catch (error: unknown) {
      handleApiError(
        error,
        "Something went wrong while fetching users.",
        "Search Failed"
      );
      setUsers([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleClickChat = async (userId: string) => {
    try {
      setCreatingChat(userId);
      const response = await createNewChat({ userId });
      if (response.success) {
        console.log("Chat created successfully:", response.data.chatId);
        showToast(
          "Chat created successfully!",
          `Chat ID: ${response.data.chatId}`,
          "success"
        );
      } else {
        console.error("Chat creation failed:", response.message);
        showToast("Chat creation failed", response.message, "error");
      }
    } catch (error: unknown) {
      handleApiError(
        error,
        "Something went wrong while creating a chat.",
        "Chat Creation Failed"
      );
    } finally {
      setCreatingChat("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7">
          <Search size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg transition-all duration-300 animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Search Users
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Search users by username and send them a friend request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center border rounded-md p-2 gap-2">
            <Search size={16} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by username"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 outline-none bg-transparent text-sm text-muted-foreground"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center mt-4">
              <Loader2
                className="animate-spin text-muted-foreground"
                size={24}
              />
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-4 mt-4">
              {users.map((user, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-md animate-fade-in"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.avatar}
                        alt={user.username}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleClickChat(user._id)}
                    disabled={creatingChat === user._id}
                  >
                    {creatingChat === user._id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        <UserPlus size={16} />
                        Chat with {user.username}
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <p className="text-center text-sm text-muted-foreground mt-4">
              No users found for &quot;{query}&quot;
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchUsers;
