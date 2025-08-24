import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UsersRound } from "lucide-react";
import { memo, useEffect, useState } from "react";
import StepSelectMembers from "./step-select-members";
import StepGroupInfo from "./step-group-info";
import StepGroupSettings from "./step-group-settings";

export type TFormData = {
  groupName: string;
  image: FileList | null;
  selectedUsers: string[];
  allowReactions: boolean;
  allowMessagePinning: boolean;
  editGroupInfo: boolean;
  sendNewMessages: boolean;
  invitePermissions: "everyone" | "admin";
};

export type TFormUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

const users = [
  {
    id: "1",
    name: "Luck",
    email: "luck@gmail.com",
    avatar:
      "https://plus.unsplash.com/premium_photo-1672116453187-3aa64afe04ad?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    name: "Linsey Juiet ~ 64.",
    email: "linsey@example.com",
    avatar:
      "https://plus.unsplash.com/premium_photo-1672116453187-3aa64afe04ad?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    name: "Ravi",
    email: "ravi@example.com",
    avatar:
      "https://plus.unsplash.com/premium_photo-1672116453187-3aa64afe04ad?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

function GroupChatForm() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<TFormData>({
    allowMessagePinning: false,
    allowReactions: true,
    editGroupInfo: false,
    groupName: "",
    image: null,
    invitePermissions: "admin",
    sendNewMessages: true,
    selectedUsers: [],
  });

  const onSubmit = () => {
    console.log(formData);
  };

  useEffect(() => {
    setStep(1);
    setFormData({
      allowMessagePinning: false,
      allowReactions: true,
      editGroupInfo: false,
      groupName: "",
      image: null,
      invitePermissions: "everyone",
      sendNewMessages: true,
      selectedUsers: [],
    });
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7">
          <UsersRound size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === 1
              ? "Select Members"
              : step === 2
              ? "Group Info"
              : "Group Settings"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {step === 1
              ? "Choose people to add to this group."
              : step === 2
              ? "Set a name and image for your group."
              : "Adjust permissions and features for this group."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <StepSelectMembers
            selectedUserIds={formData.selectedUsers}
            onChange={(users) =>
              setFormData({ ...formData, selectedUsers: users })
            }
          />
        )}

        {step === 2 && (
          <StepGroupInfo
            users={users}
            selectedUserIds={formData.selectedUsers}
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {step === 3 && (
          <StepGroupSettings formData={formData} setFormData={setFormData} />
        )}

        {/* Footer Navigation */}
        <div className="pt-4 flex justify-end gap-3">
          {step > 1 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(step - 1)}
              className="transition-all duration-200 hover:scale-95"
            >
              Back
            </Button>
          )}

          {step < 3 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && formData.selectedUsers.length === 0}
              className="transition-all duration-200 hover:scale-105"
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              className="transition-all duration-200 hover:scale-105"
              onClick={onSubmit}
            >
              Create
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(GroupChatForm);
