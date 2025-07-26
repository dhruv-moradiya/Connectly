import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";

type FriendRequest = {
  id: string;
  name: string;
  avatar: string;
};

const mockRequests: FriendRequest[] = [
  {
    id: "1",
    name: "Emily Stone",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "2",
    name: "Mike Johnson",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    id: "3",
    name: "Sophia Lee",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const FriendRequestsDialog = () => {
  const [requests, setRequests] = useState<FriendRequest[]>(mockRequests);

  const handleAction = (id: string, accepted: boolean) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
    console.log(`${accepted ? "Accepted" : "Declined"} request from ID:`, id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7">
          <UserPlusIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Friend Requests
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Manage incoming friend requests.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[400px] overflow-y-auto mt-2 animate-fade-in">
          {requests.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">
              No new friend requests.
            </p>
          ) : (
            requests.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-md border hover:shadow-sm transition-all duration-200 animate-scale-in"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-xs">
                      has sent you a friend request
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-red-100 text-red-600"
                    onClick={() => handleAction(user.id, false)}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    className="cursor-pointer bg-green-600 hover:bg-green-700"
                    onClick={() => handleAction(user.id, true)}
                  >
                    <CheckIcon className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequestsDialog;
