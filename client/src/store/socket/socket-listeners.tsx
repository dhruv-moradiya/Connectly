import { SocketEvents } from "@/lib/constants";
import type {
  ClientToServerEventNames,
  IJoinRoomError,
  IJoinRoomSuccess,
  TChatCreatedEventReceived,
  TClientToServerEvents,
  TMessageReceivedEventReceived,
  TServerToClientEvents,
  TypedSocket,
} from "@/types/middleware.type";
import type { MiddlewareAPI } from "@reduxjs/toolkit";
import { chatCreatedReducer } from "../chats/user-chats-slice";
import { showToast } from "@/lib/utils";
import { messageReceivedReducer } from "../active-chat/active-chat-slice";
import type { IMessage } from "@/types/api-response.type";

const SOCKET_LISTENERS = (store: MiddlewareAPI) => ({
  [SocketEvents.CHAT_CREATED]: (data: TChatCreatedEventReceived) => {
    console.log("📢 Chat created:", data);
    store.dispatch(chatCreatedReducer(data.data));
  },

  [SocketEvents.MESSAGE_RECEIVED]: (data: IMessage) => {
    console.log("📨 Message received:", data);
    store.dispatch(messageReceivedReducer(data));
  },

  [SocketEvents.MESSAGE_SENT]: (data: TMessageReceivedEventReceived) => {
    console.log("✅ Message sent:", data);
  },

  [SocketEvents.JOIN_ROOM_ERROR]: (data: IJoinRoomError) => {
    showToast("Join room error", data.message, "error");
  },

  [SocketEvents.JOIN_ROOM_SUCCESS]: (data: IJoinRoomSuccess) => {
    showToast("Join room success", data.message, "success");
  },

  // Add more events here...
});

function registerSocketListeners(store: MiddlewareAPI, socket: TypedSocket) {
  if (!socket) return;

  const listeners: Partial<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<keyof TServerToClientEvents, (...args: any[]) => void>
  > = SOCKET_LISTENERS(store);

  (
    Object.entries(listeners) as [
      keyof TServerToClientEvents,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (...args: any[]) => void
    ][]
  ).forEach(([event, handler]) => {
    socket.on(event, handler);
  });
}

export function emitToServer<Event extends ClientToServerEventNames>(
  socket: TypedSocket,
  event: Event,
  ...args: Parameters<TClientToServerEvents[Event]>
) {
  socket.emit(event, ...args);
}

export { registerSocketListeners };
