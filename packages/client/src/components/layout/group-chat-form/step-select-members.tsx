import clsx from "clsx";
import AnimatedCheck from "@/components/common/animated-check";
import CommonTooltip from "@/components/common/common-tooltip";
import { useAppSelector } from "@/store/store";

type Props = {
  selectedUserIds: string[];
  onChange: (ids: string[]) => void;
};

export default function StepSelectMembers({
  selectedUserIds,
  onChange,
}: Props) {
  const { isLoading, connections, error } = useAppSelector(
    (state) => state.connections
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
      {/* ----- Loading State ----- */}
      {isLoading && connections.length === 0 && (
        <p className="text-sm text-muted-foreground">Loading connections...</p>
      )}

      {/* ----- Error State ----- */}
      {!isLoading && error && <p className="text-sm text-red-500">{error}</p>}

      {/* ----- Empty State ----- */}
      {!isLoading && !error && connections.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You have no connections. Add connections to create a group chat.
        </p>
      )}

      {/* ----- Success State ----- */}
      {connections.length > 0 &&
        connections.map((user) => {
          const selected = selectedUserIds.includes(user._id);
          return (
            <div
              key={user._id}
              className={clsx(
                "flex items-center gap-3 p-2 rounded-md border cursor-pointer transition-all duration-150",
                selected ? "bg-primary/10 border-primary" : "hover:bg-muted"
              )}
              onClick={() =>
                onChange(
                  selected
                    ? selectedUserIds.filter((id) => id !== user._id)
                    : [...selectedUserIds, user._id]
                )
              }
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="flex-1">
                <CommonTooltip title={user.username}>
                  <p className="w-fit text-sm font-medium line-clamp-1">
                    {user.username}
                  </p>
                </CommonTooltip>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>

              <AnimatedCheck selected={selected} />
            </div>
          );
        })}
    </div>
  );
}
