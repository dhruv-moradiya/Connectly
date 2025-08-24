import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import type { TFormData, TFormUser } from "./group-chat-form";

type Props = {
  users: TFormUser[];
  selectedUserIds: string[];
  formData: TFormData;
  setFormData: React.Dispatch<React.SetStateAction<TFormData>>;
};

export default function StepGroupInfo({
  users,
  selectedUserIds,
  formData,
  setFormData,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Selected Avatars */}
      <div className="flex -space-x-2 overflow-hidden">
        {users
          .filter((u) => selectedUserIds.includes(u.id))
          .map((user) => (
            <div
              key={user.id}
              className="size-10 overflow-hidden rounded-full border-2 border-white"
            >
              <img
                src={user.avatar}
                className="w-full h-full object-cover"
                alt={user.name}
                loading="lazy"
              />
            </div>
          ))}
      </div>

      {/* Group Name */}
      <div>
        <label className="text-sm font-medium">Group Name</label>
        <Input
          placeholder="Ex: Weekend Plans"
          className="mt-1"
          value={formData.groupName}
          onChange={(e) =>
            setFormData({ ...formData, groupName: e.target.value })
          }
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="text-sm font-medium">Group Image</label>
        <div className="mt-1 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ImageIcon className="w-4 h-4" />
            Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files })
              }
            />
          </label>
          {formData.image && formData.image.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {formData.image[0]?.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
