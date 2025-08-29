import type { IMessage, IUserPreview } from "./api-response.type";

type TTheme = "dark" | "light" | "system";

enum InteractionMode {
  NONE = "none",
  DELETE = "delete",
  REPLY = "reply",
  REACT = "react",
  PIN = "pin",
  drag = "drag",
}

interface IActiveChatDetails {
  _id: string;
  participants: IUserPreview[];
  isCurrentuseradmin: boolean;
  createdBy: string;
  groupIcon: {
    publicId: string;
    url: string;
  } | null;
  isGroup: boolean;
  lastMessage: IMessage;
  headerName: string;
  unreadCount: [];
  avatarUrl: string;
  fallback: string;
}

export { type TTheme, type IActiveChatDetails };
export { InteractionMode };
