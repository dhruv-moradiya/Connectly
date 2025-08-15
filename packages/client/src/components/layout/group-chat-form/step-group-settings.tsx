import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TFormData } from "./group-chat-form";
import SwitchToggle from "@/components/common/switch-toggle";

const settings: {
  label: string;
  desc: string;
  default: boolean;
  name:
    | "allowReactions"
    | "allowMessagePinning"
    | "editGroupInfo"
    | "sendNewMessages";
}[] = [
  {
    label: "Allow Reactions",
    desc: "Let members react to messages with emojis.",
    default: true,
    name: "allowReactions",
  },
  {
    label: "Allow Message Pinning",
    desc: "Allow members to pin important messages to the chat.",
    default: false,
    name: "allowMessagePinning",
  },
  {
    label: "Edit Group Info",
    desc: "Decide who can change the group name, description, and photo.",
    default: true,
    name: "editGroupInfo",
  },
  {
    label: "Send New Messages",
    desc: "Control who can send messages in this group.",
    default: true,
    name: "sendNewMessages",
  },
];

type Props = {
  formData: TFormData;
  setFormData: React.Dispatch<React.SetStateAction<TFormData>>;
};

export default function StepGroupSettings({ formData, setFormData }: Props) {
  return (
    <div className="space-y-4">
      {/* Invite permissions */}
      <div className="flex items-center justify-between gap-4 py-2 border-b">
        <div className="flex flex-col gap-0.5">
          <Label className="font-medium">Invite Permissions</Label>
          <span className="text-xs text-muted-foreground">
            Decide who can invite new members to this group.
          </span>
        </div>
        <Select
          value={formData.invitePermissions}
          onValueChange={(v) =>
            setFormData({
              ...formData,
              invitePermissions: v as "everyone" | "admin",
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Who can invite?</SelectLabel>
              <SelectItem value="admin">Admins only</SelectItem>
              <SelectItem value="everyone">Everyone</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Toggle settings */}
      {settings.map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between gap-4 py-2 border-b last:border-none"
        >
          <div className="flex flex-col gap-0.5">
            <Label className="font-medium">{item.label}</Label>
            <span className="text-xs text-muted-foreground">{item.desc}</span>
          </div>
          <div>
            <SwitchToggle
              defaultChecked={formData[item.name] ?? item.default}
              onChange={(v) => setFormData({ ...formData, [item.name]: v })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
