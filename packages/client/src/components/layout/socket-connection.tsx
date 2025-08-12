import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  createConnection,
  disconnectConnection,
} from "@/store/socket/socket.slice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SocketConnection = () => {
  const dispatch = useAppDispatch();
  const { isConnected } = useAppSelector((state) => state.socket);

  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    if (isConnected) {
      dispatch(disconnectConnection());
    } else {
      dispatch(createConnection());
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Status Dot */}
      <DialogTrigger asChild>
        <div
          className={cn(
            "size-3 rounded-full cursor-pointer shadow-md border border-white",
            isConnected
              ? "bg-green-500 animate-pulse"
              : "bg-red-500 animate-none"
          )}
        />
      </DialogTrigger>

      {/* Confirmation Dialog */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isConnected ? "Disconnect from Server?" : "Connect to Server?"}
          </DialogTitle>
          <DialogDescription>
            {isConnected
              ? "You are currently connected. Disconnecting will stop receiving real-time updates."
              : "You are currently disconnected. Connecting will allow you to receive real-time updates."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={isConnected ? "destructive" : "default"}
            onClick={handleConfirm}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocketConnection;
