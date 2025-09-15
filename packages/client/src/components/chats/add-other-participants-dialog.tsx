import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  UserPlus2,
  Link as LinkIcon,
  Copy,
  Check,
  Loader2,
  Search,
  UserPlus,
} from "lucide-react";
import type { IUserPreview } from "@/types/api-response.type";
import { addUserInGroupChat, getUserByUsernameQuery } from "@/api";
import { handleApiError } from "@/lib/handle-api-error";
import { showToast } from "@/lib/utils";
import { useParams } from "react-router-dom";

export default function AddParticipantsDialog() {
  const { chatId } = useParams();
  const [activeTab, setActiveTab] = useState("link");

  // Invite link state
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [creatingLink, setCreatingLink] = useState(false);

  // Search state
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUserPreview[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [addingUser, setAddingUser] = useState<string>("");

  // ---- Mock API ----
  const createInviteLink = async () => {
    setCreatingLink(true);
    setTimeout(() => {
      setInviteLink("https://connecly.app/invite/xyz123");
      setCreatingLink(false);
    }, 1000);
  };

  const handleCopy = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

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

  const handleAddUser = async (userId: string) => {
    setAddingUser(userId);

    try {
      const response = await addUserInGroupChat({
        userIds: [userId],
        chatId: chatId ?? "",
      });
      showToast("", response.message, "success");
    } catch (error) {
      handleApiError(
        error,
        "Something went wrong while fetching users.",
        "Search Failed"
      );
    } finally {
      setAddingUser("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <UserPlus2 className="mr-2 h-4 w-4" />
          Add other participants
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base md:text-xl font-semibold">
            Add participants to group
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Invite others by link or search users directly.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="link"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-2 w-full mt-4">
            <TabsTrigger value="link">Invite Link</TabsTrigger>
            <TabsTrigger value="search">Search Users</TabsTrigger>
          </TabsList>

          {/* -------- OPTION 1: Invite Link -------- */}
          <TabsContent value="link" className="mt-4 space-y-4">
            {!inviteLink ? (
              <Button
                onClick={createInviteLink}
                disabled={creatingLink}
                className="w-full flex items-center gap-2"
              >
                {creatingLink ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LinkIcon size={16} />
                )}
                {creatingLink ? "Creating link..." : "Generate Invite Link"}
              </Button>
            ) : (
              <>
                <div className="flex items-center gap-2 border rounded-md p-2">
                  <Input value={inviteLink} readOnly className="flex-1" />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopy}
                    disabled={copySuccess}
                  >
                    {copySuccess ? (
                      <Check className="text-green-500" size={18} />
                    ) : (
                      <Copy size={18} />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  This link will automatically expire after{" "}
                  <span className="font-medium">1 hour</span>.
                </p>
              </>
            )}
          </TabsContent>

          {/* -------- OPTION 2: Direct Search + Add -------- */}
          <TabsContent value="search" className="mt-4 space-y-4">
            <div className="flex items-center border rounded-md p-2 gap-2">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by username"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 outline-none bg-transparent text-sm"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleAddUser(user._id)}
                      disabled={addingUser === user._id}
                    >
                      {addingUser === user._id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>
                          <UserPlus size={16} /> Add
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : hasSearched ? (
              <p className="text-center text-sm text-muted-foreground">
                No users found for “{query}”
              </p>
            ) : null}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
