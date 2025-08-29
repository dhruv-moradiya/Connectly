import { TMessageDeliveryStatus } from "@monorepo/shared/src/types/message.types";

enum MessageJobEnum {
  SAVE_MESSAGE = "save_message",
  UPDATE_DELIVERY_STATUS = "update_delivery_status",
  DELETE_SINGLE_MESSAGE = "delete_single_message",
  DELETE_MULTIPLE_MESSAGE = "delete_multiple_message",
}

 interface IJobMap {
  [MessageJobEnum.SAVE_MESSAGE]: IMessagesaveInDBJobType;
  [MessageJobEnum.UPDATE_DELIVERY_STATUS]: {
    _id: string;
    status: TMessageDeliveryStatus;
  };
  [MessageJobEnum.DELETE_SINGLE_MESSAGE]: { _id: string };
  [MessageJobEnum.DELETE_MULTIPLE_MESSAGE]: { ids: string[] };
}



interface IMessagesaveInDBJobType {
  _id: string;
  chatId: string;
  content: string;
  sender: string;
  replyTo: { _id: string; content: string } | null;
}

interface ISaveMessageJob {
  name: MessageJobEnum.SAVE_MESSAGE;
  data: IMessagesaveInDBJobType
}

interface IUpdateDeliveryStatusJob {
  name: MessageJobEnum.UPDATE_DELIVERY_STATUS;
  data: {
    _id: string;
    status: TMessageDeliveryStatus;
  };
}

interface IDeleteSingleMessageJob {
  name: MessageJobEnum.DELETE_SINGLE_MESSAGE;
  data: {
    _id: string;
  };
}

type TMessageJobType = {
  [K in keyof IJobMap]: {
    name: K;
    data: IJobMap[K];
  };
}[keyof IJobMap];

export {
  type IJobMap,
  type IMessagesaveInDBJobType,
  type TMessageJobType,
  type ISaveMessageJob,
  type IUpdateDeliveryStatusJob,
  type IDeleteSingleMessageJob,
};
export { MessageJobEnum };
