import clsx from "clsx";
import AnimatedCheck from "@/components/common/animated-check";
import type { TFormUser } from "./group-chat-form";

type Props = {
  users: TFormUser[];
  selectedUserIds: string[];
  onChange: (ids: string[]) => void;
};

export default function StepSelectMembers({
  users,
  selectedUserIds,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
      {users.map((user) => {
        const selected = selectedUserIds.includes(user.id);
        return (
          <div
            key={user.id}
            className={clsx(
              "flex items-center gap-3 p-2 rounded-md border cursor-pointer transition-all duration-150",
              selected ? "bg-primary/10 border-primary" : "hover:bg-muted"
            )}
            onClick={() =>
              onChange(
                selected
                  ? selectedUserIds.filter((id) => id !== user.id)
                  : [...selectedUserIds, user.id]
              )
            }
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <AnimatedCheck selected={selected} />
          </div>
        );
      })}
    </div>
  );
}
