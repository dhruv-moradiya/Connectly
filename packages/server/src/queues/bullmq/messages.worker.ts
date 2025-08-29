// ---------- worker.ts ----------
import { Job, Worker } from "bullmq";
import { redisConnection } from "../../db/redis";
import { MessageJobEnum, IJobMap, TMessageJobType } from "../../types/message-queue.type";
import { messageJobServiceInstance } from "../../services/message-job.service";

const messagesWorker = new Worker<TMessageJobType>(
  "messages",
  async (job: Job<any>) => {
    switch (job.name) {
      case MessageJobEnum.SAVE_MESSAGE: {
   

        await messageJobServiceInstance.saveMessageInDB(
          job.data as IJobMap[MessageJobEnum.SAVE_MESSAGE]
        );
        break;
      }

      case MessageJobEnum.UPDATE_DELIVERY_STATUS: {
      
        await messageJobServiceInstance.updateDeliveryStatus(
          job.data as IJobMap[MessageJobEnum.UPDATE_DELIVERY_STATUS]
        );
        break;
      }

      case MessageJobEnum.DELETE_SINGLE_MESSAGE: {
        // await messageJobServiceInstance.deleteSingle(
        //   job.data as JobMap[MessageJobEnum.DELETE_SINGLE_MESSAGE]
        // );
        break;
      }

      case MessageJobEnum.DELETE_MULTIPLE_MESSAGE: {
        // await messageJobServiceInstance.deleteMultiple(
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
