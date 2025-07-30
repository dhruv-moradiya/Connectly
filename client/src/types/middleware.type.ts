import type { IUserPreview } from "./api-response.type";

type TChatCreatedEventReceived = {
  data: {
    _id: string;
    name: string;
    isGroup: boolean;
    participants: IUserPreview[];
    unreadCount: [];
  };
  message: string;
};

type TMessageReceivedEventReceived = {
  _id: string;
  content: string;
  sender: string;
  chatId: string;
};

export type { TChatCreatedEventReceived, TMessageReceivedEventReceived };
