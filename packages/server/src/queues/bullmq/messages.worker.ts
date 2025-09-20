import { Job, Worker } from "bullmq";
import { redisConnection } from "../../db/redis";
import {
  MessageJobEnum,
  IJobMap,
  TMessageJobType,
} from "../../types/message-queue.type";
import { messageWorkerServiceInstance } from "../../services/message-worker.service";

const messagesWorker = new Worker<TMessageJobType>(
  "messages",
  async (job: Job<any>) => {
    switch (job.name) {
      case MessageJobEnum.SAVE_MESSAGE: {
        await messageWorkerServiceInstance.saveMessageInDB(
          job.data as IJobMap[MessageJobEnum.SAVE_MESSAGE]
        );
        break;
      }

      case MessageJobEnum.UPDATE_DELIVERY_STATUS: {
        await messageWorkerServiceInstance.updateDeliveryStatus(
          job.data as IJobMap[MessageJobEnum.UPDATE_DELIVERY_STATUS]
        );
        break;
      }

      case MessageJobEnum.DELETE_SINGLE_MESSAGE: {
        // await messageWorkerServiceInstance.deleteSingle(
        //   job.data as JobMap[MessageJobEnum.DELETE_SINGLE_MESSAGE]
        // );
        break;
      }

      case MessageJobEnum.DELETE_MULTIPLE_MESSAGE: {
        // await messageWorkerServiceInstance.deleteMultiple(
        //   job.data as JobMap[MessageJobEnum.DELETE_MULTIPLE_MESSAGE]
        // );
        break;
      }

      default: {
        // const _exhaustive: never = job;
        throw new Error(`Unhandled job type: ${(job as any).name}`);
      }
    }
  },
  { connection: redisConnection }
);

export { messagesWorker };
