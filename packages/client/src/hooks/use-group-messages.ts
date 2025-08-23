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

  const groupedMessages = useMemo(() => {
    return messages.map((msg, index, arr) => {
      const currentDate = format(new Date(msg.createdAt), "dd-MMM-yyyy");
      const prevDate =
        index > 0
          ? format(new Date(arr[index - 1].createdAt), "dd-MMM-yyyy")
          : null;

      if (currentDate !== prevDate) {
        return {
          ...msg,
          showDateSeparator: true,
          dateSeparator: currentDate,
        };
      }
      return msg;
    });
  }, [messages]);

  return {
    groups,
    flatMessages,
    groupCounts,
    groupedMessages,
  };
};

export { useGroupMessages };
