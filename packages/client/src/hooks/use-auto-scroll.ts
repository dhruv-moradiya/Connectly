import { useAppSelector } from "@/store/store";
import type {
  IMessage,
  IReplyMessage,
  TMessageDeliveryStatus,
  TMessageSenderDetails,
  TMessageType,
} from "@/types/api-response.type";
import type { Virtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";

type IGroupedMessages =
  | IMessage[]
  | {
      showDateSeparator: boolean;
      dateSeparator: string;
      _id: string;
      content: string;
      createdAt: string;
      deliveryStatus: TMessageDeliveryStatus;
      type: TMessageType;
      sender: TMessageSenderDetails;
      replyTo: IReplyMessage | null;
    }[];

export function useAutoScroll(
  virtualizer: Virtualizer<HTMLDivElement, Element>,
  groupedMessages: IGroupedMessages
) {
  const isFirstRender = useRef(true);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (isFirstRender.current && groupedMessages.length > 0) {
      virtualizer.scrollToIndex(groupedMessages.length - 1, {
        align: "end",
        behavior: "auto",
      });
      isFirstRender.current = false;
      return;
    }

    const lastMsg = groupedMessages[groupedMessages.length - 1];
    if (lastMsg?.sender._id === user?._id) {
      virtualizer.scrollToIndex(groupedMessages.length - 1, {
        align: "end",
        behavior: "auto",
      });
    } else {
      console.log("Show button");
    }
  }, [groupedMessages.length, user, virtualizer]);
}
