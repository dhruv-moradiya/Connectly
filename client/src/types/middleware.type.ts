import { Interface } from "readline";
import type { IUserPreview } from "./api-response.type";

interface IBaseSocketResponse {
  success: boolean;
  message: string;
}

interface IJoinRoomError extends IBaseSocketResponse {
  data: null;
}

interface IJoinRoomSuccess extends IBaseSocketResponse {
  data: {
    chatId: string;
  };
}

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

export type {
  IJoinRoomError,
  IJoinRoomSuccess,
  TChatCreatedEventReceived,
  TMessageReceivedEventReceived,
};
