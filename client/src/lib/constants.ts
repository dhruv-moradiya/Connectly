const ActionType = {
  CREATE_CONNECTION: "socket/createConnection",

  SEND_MESSAGE: "activeChat/sendMessage",

  SET_ACTIVE_CHAT: "activeChat/setActiveChat",
  CLEAR_ACTIVE_CHAT: "activeChat/clearActiveChat",
} as const;

const SocketEvents = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ERROR_CONNECTING: "error_connecting",
  INVALID_DATA: "invalid_data",

  JOIN_ROOM: "join_room",
  JOIN_ROOM_ERROR: "join_room_error",
  JOIN_ROOM_SUCCESS: "join_room_success",
  LEAVE_ROOM: "leave_room",

  MESSAGE_SENT: "message_sent",
  MESSAGE_RECEIVED: "message_received", // ✅
  MESSAGE_DELETED: "message_deleted",
  MESSAGE_EDITED: "message_edited",
  MESSAGE_PINNED: "message_pinned",
  MESSAGE_UNPINNED: "message_unpinned",
  MESSAGE_SAVED: "message_saved",
  MESSAGE_DELIVERED: "message_delivered",
  MESSAGE_SEEN: "message_seen",

  UPDATE_PROFILE_PIC: "update_profile_pic",

  CHANGE_GROUP_CHAT_NAME: "change_group_chat_name",
  CHANGE_GROUP_CHAT_DESCRIPTION: "change_group_chat_description",

  CHAT_CREATED: "chat_created", // ✅
  CHAT_UPDATED: "chat_updated",
  CHAT_DELETED: "chat_deleted",

  CHAT_MEMBERS_ADDED: "chat_members_added",
  CHAT_MEMBERS_REMOVED: "chat_members_removed",
  CHAT_MEMBERS_ROLE_CHANGED: "chat_members_role_changed",

  USER_TYPING: "user_typing",
  USER_STOPPED_TYPING: "user_stopped_typing",

  USER_JOINED_ROOM: "user_joined_room",
  USER_LEFT_ROOM: "user_left_room",

  USER_JOINED_LOBBY: "user_joined_lobby",
  USER_LEFT_LOBBY: "user_left_lobby",
} as const;

export { ActionType, SocketEvents };
export type SocketEventType = (typeof SocketEvents)[keyof typeof SocketEvents];
export type ActionType = (typeof ActionType)[keyof typeof ActionType];
