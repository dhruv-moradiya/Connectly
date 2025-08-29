import { TMessageDeliveryStatus } from "@monorepo/shared/src/types/message.types";

enum MessageJobType {
  SAVE_MESSAGE = "save_message",
  UPDATE_DELIVERY_STATUS = "update_delivery_status",
  DELETE_SINGLE_MESSAGE = "delete_single_message",
  DELETE_MULTIPLE_MESSAGE = "delete_multiple_message",
}

interface ISaveMessageJob {
  name: MessageJobType.SAVE_MESSAGE;
  data: {
    _id: string;
    chatId: string;
    content: string;
    sender: string;
    replyTo: { _id: string; content: string } | null;
  };
}

interface IUpdateDeliveryStatusJob {
  name: MessageJobType.UPDATE_DELIVERY_STATUS;
  data: {
    _id: string;
    status: TMessageDeliveryStatus;
  };
}

interface IDeleteMessageJob {
  name: MessageJobType.DELETE_SINGLE_MESSAGE;
  data: {
    _id: string;
  };
}

export {
  type ISaveMessageJob,
  type IUpdateDeliveryStatusJob,
  type IDeleteMessageJob,
};
export { MessageJobType };
