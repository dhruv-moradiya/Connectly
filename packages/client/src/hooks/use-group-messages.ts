import { useMemo } from "react";
import { format } from "date-fns";
import type { IMessage } from "@/types/api-response.type";

const useGroupMessages = ({ messages }: { messages: IMessage[] }) => {
  const groups = useMemo(() => {
    const groups: { date: string; items: typeof messages }[] = [];
    messages.forEach((msg) => {
      if (!msg) return;

      const date = format(
        new Date(msg.createdAt ? msg.createdAt : Date.now()),
        "dd-MMM-yyyy"
      );
      const lastGroup = groups[groups.length - 1];
      if (!lastGroup || lastGroup.date !== date) {
        groups.push({ date, items: [msg] });
      } else {
        lastGroup.items.push(msg);
      }
    });
    return groups;
  }, [messages]);

  const flatMessages = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const groupCounts = useMemo(
    () => groups.map((g) => g.items.length),
    [groups]
  );

  return {
    groups,
    flatMessages,
    groupCounts,
  };
};

export { useGroupMessages };
