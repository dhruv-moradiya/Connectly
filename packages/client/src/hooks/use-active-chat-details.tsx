import { useAppSelector } from "@/store/store";
import type { IActiveChatDetails } from "@/types/index.type";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const DEFAULT_AVATAR =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROwEIMOLfVpbKfw9EYVreHkPB4FAmFJ7DYow&s";

const useActiveChatDetails = (): IActiveChatDetails | null => {
  const { chatId } = useParams<{ chatId: string }>();
  const chats = useAppSelector((state) => state.userChats.chats);
  const user = useAppSelector((state) => state.auth.user);

  return useMemo(() => {
    const chat = chats.find((c) => c._id === chatId);

    if (!chat || !user) return null;

    if (chat.isGroup) {
      const name = chat.name || "Unnamed Group";
      return {
        _id: chat._id,
        participants: chat.participants,
        isCurrentuseradmin:
          chat.participants.find((p) => p._id === user._id)?.role === "admin",
        createdBy: chat.createdBy,
        groupIcon: chat.groupIcon ?? null,
        isGroup: chat.isGroup,
        lastMessage: chat.lastMessage,
        headerName: name,
        unreadCount: chat.unreadCount ?? 0,
        avatarUrl: chat.groupIcon?.url ?? DEFAULT_AVATAR,
        fallback: name[0]?.toUpperCase() ?? "G",
      };
    } else {
      const otherUser = chat.participants.find((p) => p._id !== user._id);
      const headerName = otherUser?.username ?? "Unknown User";

      return {
        _id: chat._id,
        participants: chat.participants,
        isCurrentuseradmin:
          chat.participants.find((p) => p._id === user._id)?.role === "admin",
        createdBy: chat.createdBy,
        groupIcon: null,
        isGroup: chat.isGroup,
        lastMessage: chat.lastMessage,
        headerName,
        unreadCount: chat.unreadCount ?? 0,
        avatarUrl: otherUser?.avatar ?? DEFAULT_AVATAR,
        fallback: headerName[0]?.toUpperCase() ?? "U",
      };
    }
  }, [chatId, chats, user]);
};

export { useActiveChatDetails };
