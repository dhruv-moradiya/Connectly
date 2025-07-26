"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CheckIcon, ImageIcon, UsersRound } from "lucide-react";
import clsx from "clsx";

// Mock user data
const users = [
  {
    id: "1",
    name: "Luck",
    email: "luck@gmail.com",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx0kuLHyU-1CP7Tarm-mlm30SzMvvjm-XclfUJjZXgG2v-ZmO3_pKOakHuvHax45ZxkEA6UmOfDji4tfmE3LZa9lscqfceaB2r6Qmu3WKtkw",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@example.com",
    avatar:
      "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTxDSFN2ZuQxetzPn99Dykq0uuXYmFF7r7SGg8YVnY2GZGoXZ2GQg10NZDjK47EFO_OUJacvPgtAN6xacS39_-0lbIkb2ta0LV6onS1S2QL",
  },
  {
    id: "3",
    name: "John Smith",
    email: "john@example.com",
    avatar: "https://i.mydramalist.com/oQNyYk_5f.jpg",
  },
];

type FormValues = {
  groupName: string;
  image: FileList;
};

const GroupChatForm = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const { register, handleSubmit, watch } = useForm<FormValues>();

  const image = watch("image");

  const toggleUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const onSubmit = (data: FormValues) => {
    const selectedUsers = users.filter((user) =>
      selectedUserIds.includes(user.id)
    );

    console.log("Creating group chat with:");
    console.log("Name:", data.groupName);
    console.log("Image:", data.image?.[0]);
    console.log("Users:", selectedUsers);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="size-7">
          <UsersRound size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === 1 ? "Select Members" : "Group Info"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {step === 1
              ? "Choose people to add to this group."
              : "Set a name and image for your group."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {users.map((user) => {
                const selected = selectedUserIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className={clsx(
                      "flex items-center gap-3 p-2 rounded-md border cursor-pointer transition-all duration-150 transform",
                      selected
                        ? "bg-primary/10 border-primary animate-scale-in"
                        : "hover:bg-muted"
                    )}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    {selected && <CheckIcon className="w-4 h-4 text-primary" />}
                  </div>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              {/* Selected Avatars with entry animation */}
              <div className="flex -space-x-2 overflow-hidden animate-fade-in">
                {users
                  .filter((u) => selectedUserIds.includes(u.id))
                  .map((user) => (
                    <div
                      key={user.id}
                      className="size-10 overflow-hidden rounded-full border-2 border-white animate-scale-in"
                    >
                      <img
                        src={user.avatar}
                        className="w-full h-full object-cover"
                        alt={user.name}
                      />
                    </div>
                  ))}
              </div>

              {/* Group Name */}
              <div className="animate-fade-in delay-100">
                <label className="text-sm font-medium">Group Name</label>
                <Input
                  placeholder="Ex: Weekend Plans"
                  {...register("groupName", { required: true })}
                  className="mt-1"
                />
              </div>

              {/* Image Upload */}
              <div className="animate-fade-in delay-150">
                <label className="text-sm font-medium">Group Image</label>
                <div className="mt-1 flex items-center gap-2">
                  <label className="cursor-pointer flex items-center gap-2 text-sm font-medium text-primary transition-all duration-150 hover:underline">
                    <ImageIcon className="w-4 h-4" />
                    Upload
                    <input
                      type="file"
                      {...register("image")}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  {image && image.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {image[0]?.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4 flex justify-between animate-fade-in delay-200">
            {step === 2 ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="transition-all duration-200 hover:scale-95"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="transition-all duration-200 hover:scale-105"
                >
                  Create
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() =>
                  step === 1 && selectedUserIds.length > 0 && setStep(2)
                }
                disabled={selectedUserIds.length === 0}
                className="transition-all duration-200 hover:scale-105"
              >
                Next
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupChatForm;
