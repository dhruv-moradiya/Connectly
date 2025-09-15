import { messagesQueue } from "../queues/bullmq/messages.queue";
import { MessageJobEnum } from "..//types/message-queue.type";
import { TMessageDeliveryStatus } from "@monorepo/shared/src/types/message.types";

class JobQueueService {
  static async enqueueMessageStatusUpdate(data: {
    _id: string;
    status: TMessageDeliveryStatus;
  }) {
    await messagesQueue.add(MessageJobEnum.UPDATE_DELIVERY_STATUS, {
      _id: data._id,
      status: data.status,
    });
  }
}

const jobQueueServiceInstace = new JobQueueService();
export { JobQueueService, jobQueueServiceInstace };
