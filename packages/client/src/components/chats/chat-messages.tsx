import { useAppSelector } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "./chat-bubble/chat-bubble";
import {
  useCurrentlyRenderedData,
  VirtuosoMessageList,
  VirtuosoMessageListLicense,
  type VirtuosoMessageListMethods,
  type VirtuosoMessageListProps,
} from "@virtuoso.dev/message-list";
import type { IMessage } from "@/types/api-response.type";
import { format, getDate } from "date-fns";

const ChatMessages = () => {
  const virtuoso = useRef<VirtuosoMessageListMethods<IMessage>>(null);
  const { messages } = useAppSelector((state) => state.activeChat);

  const [data, setData] = useState<
    VirtuosoMessageListProps<IMessage, []>["data"]
  >({
    data: messages,
    scrollModifier: {
      type: "item-location",
      location: { index: "LAST", align: "end" },
    },
  });

  useEffect(() => {
    setData({
      data: messages,
      scrollModifier: {
        type: "item-location",
        location: { index: "LAST", align: "end" },
      },
    });

    virtuoso.current?.scrollToItem({
      index: messages.length - 1,
      align: "end",
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <VirtuosoMessageListLicense licenseKey="">
      <VirtuosoMessageList<IMessage, null>
        data={data}
        ref={virtuoso}
        style={{ flex: 1 }}
        computeItemKey={({ data }) => data._id}
        ItemContent={ItemContent}
        StickyHeader={StickyHeader}
      />
    </VirtuosoMessageListLicense>
  );
};

const ItemContent: VirtuosoMessageListProps<IMessage, null>["ItemContent"] = ({
  data,
  prevData,
  index,
}) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user || !data) return null;

  const date =
    !prevData || getDate(prevData.createdAt) !== getDate(data.createdAt) ? (
      <div className="text-center bg-card font-medium">
        <span className="text-sm border rounded-md p-0.5 shadow-xs">
          {format(data.createdAt, "dd-MM-yyyy")}
        </span>
      </div>
    ) : null;

  return (
    <>
      {date}
      <ChatBubble
        key={data._id}
        index={index}
        isSender={data.sender._id === user._id}
        content={data.content}
        deliveryStatus={data.deliveryStatus}
      />
    </>
  );
};

const StickyHeader: VirtuosoMessageListProps<
  IMessage,
  null
>["StickyHeader"] = () => {
  const firstItem = useCurrentlyRenderedData<IMessage>()[0];

  if (!firstItem) return null;

  return (
    <div className="w-full absolute top-0">
      <div className="text-center bg-card font-medium">
        <span className="text-sm border rounded-md p-0.5 shadow-xs">
          {format(firstItem.createdAt, "dd-MM-yyyy")}
        </span>
      </div>
    </div>
  );
};

export { ChatMessages };
