import mongoose from "mongoose";
import { type Request, type Response, type NextFunction } from "express";

import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../utils/validateRequest";

import { HttpStatus, SocketEvents } from "../constants";
import chatModel, { IChatRoomDocument } from "../models/chat.model";

import {
  addParticipantsSchema,
  createGroupChatSchema,
  createNewChatBetweenTwoUsersSchema,
  renameGroupChatSchema,
  updateGroupChatDescriptionSchema,
  type IAddParticipantsBody,
  type ICreateGroupChatBody,
  type ICreateNewChatBetweenTwoUsersBody,
  type IRenameGroupChatBody,
  type IUpdateGroupChatDescriptionBody,
} from "../schemas/schema";
import ChatRoom from "../models/chat.model";
import User from "../models/user.model";
import type { IChatRoomForCache } from "@monorepo/shared/src/types/chat.types";
import { redisConnection } from "../db/redis";
import { generateRedisKeys } from "../utils";

async function cacheRooms(rooms: IChatRoomForCache[]) {
  for (const room of rooms) {
    const { _id, participants, ...roomDetails } = room;

    // Cache room details (optional)
    await redisConnection.hset(
      generateRedisKeys.roomDetails(_id.toString()),
      roomDetails
    );

    // Cache participants with role
    for (const participant of participants) {
      await redisConnection.hset(
        generateRedisKeys.roomParticipants(_id.toString()),
        participant.user.toString(), // Use user ID as field
        JSON.stringify({ role: participant.role }) // Store role as JSON
      );
    }
  }
}

// Request<Params = {}, ResBody = any, ReqBody = any, ReqQuery = ParsedQs, Locals = Record<string, any>>

const getUserPreviewData = async (user: mongoose.Types.ObjectId) => {
  const userData = await User.findById(user, {
    _id: 1,
    username: 1,
    avatar: 1,
    email: 1,
  });
  return userData;
};

const createNewChatBetweenTwoUsers = asyncHandler(
  async (
    req: Request<{}, {}, ICreateNewChatBetweenTwoUsersBody>,
    res: Response,
    next: NextFunction
  ) => {
    const validation = validateRequest(
      createNewChatBetweenTwoUsersSchema,
      req.body
    );

    if (!validation.success) {
      return next(
        new ApiError(
          "Invalid input data. Please ensure all fields are correctly filled.",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    const { userId: recipientUserId } = req.body;
    const senderUserId = req.user._id;

    if (recipientUserId === senderUserId) {
      return next(
        new ApiError(
          "You cannot create a chat with yourself.",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    if (!mongoose.Types.ObjectId.isValid(recipientUserId)) {
      return next(
        new ApiError("Invalid recipient user ID.", HttpStatus.BAD_REQUEST)
      );
    }

    const existingChat = await chatModel.aggregate([
      {
        $match: {
          "participants.user": {
            $all: [
              new mongoose.Types.ObjectId(recipientUserId),
              new mongoose.Types.ObjectId(senderUserId),
            ],
          },
        },
      },
    ]);

    if (existingChat[0]) {
      return next(
        new ApiError(
          "Chat already exists between the two users.",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    const generateParticipants = () => {
      return [recipientUserId, senderUserId].map((userId) => ({
        user: userId,
        role: userId === req.user._id ? "admin" : "member",
        invited_by: req.user._id,
      }));
    };

    const createdChat = await chatModel.create({
      participants: generateParticipants(),
      createdBy: senderUserId,
    });

    console.log("createdChat :>> ", createdChat);

    if (!createdChat) {
      return next(
        new ApiError(
          "Failed to create a new chat. Please try again later.",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    }

    // Cache chat room
    cacheRooms([
      {
        _id: createdChat._id as string,
        name: "",
        isGroup: false,
        participants: createdChat.participants.map((participant) => ({
          user: participant.user.toString(),
          role: participant.role,
        })),
        createdBy: createdChat.createdBy.toString(),
      },
    ]);

    const participantsData = await Promise.all(
      createdChat.participants.map((participant) =>
        getUserPreviewData(participant.user)
      )
    );

    const dataToEmit = {
      _id: createdChat._id,
      name: "",
      isGroup: false,
      participants: participantsData,
      unreadCount: [],
      lastMessage: {},
    };

    req.app
      .get("io")
      .to([recipientUserId, senderUserId])
      .emit(SocketEvents.CHAT_CREATED, {
        data: dataToEmit,
        message: "New chat created successfully.",
        success: true,
      });

    res.status(HttpStatus.CREATED).json(
      new ApiResponse(HttpStatus.CREATED, "Chat successfully created.", {
        chatId: createdChat._id,
      })
    );
  }
);

const createGroupChat = asyncHandler(
  async (
    req: Request<{}, {}, ICreateGroupChatBody>,
    res: Response,
    next: NextFunction
  ) => {
    const validationResult = validateRequest(createGroupChatSchema, req.body);

    if (!validationResult.success) {
      return next(
        new ApiError(
          "Invalid group chat data. Please review the fields and try again.",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    const { userIds, name, description } = req.body;
    const currentUserId = req.user._id.toString();

    // Validate all user IDs
    const allUserIds = [...userIds, currentUserId];
    const areAllIdsValid = allUserIds.every((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (!areAllIdsValid) {
      return next(
        new ApiError(
          "One or more provided user IDs are invalid.",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    // Ensure user count constraints
    if (userIds.length < 2 || userIds.length > 10) {
      return next(
        new ApiError(
          "A group chat must include between 2 and 10 participants (excluding you).",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    // Check for duplicates
    const hasDuplicates = new Set(allUserIds).size !== allUserIds.length;
    if (hasDuplicates) {
      return next(
        new ApiError(
          "Duplicate user IDs detected. Please ensure all participant IDs are unique.",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    // Check if chat with same participants already exists
    const existingChat = await chatModel.aggregate([
      { $match: { isGroup: true, "participants.user": { $all: allUserIds } } },
      {
        $project: {
          matchedUsers: {
            $size: {
              $setIntersection: ["$participants.user", allUserIds],
            },
          },
          totalUsers: { $size: "$participants" },
        },
      },
      {
        $match: {
          matchedUsers: allUserIds.length,
          totalUsers: allUserIds.length,
        },
      },
    ]);

    console.log("existingChat :>> ", existingChat);

    if (existingChat.length > 0) {
      return next(
        new ApiError(
          "A group chat with these participants already exists.",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    // Generate participant entries
    const generateParticipantEntries = (): {
      user: mongoose.Types.ObjectId;
      role: "admin" | "member";
      invited_by: mongoose.Types.ObjectId;
    }[] =>
      allUserIds.map((id) => ({
        user: new mongoose.Types.ObjectId(id),
        role: id === currentUserId ? "admin" : "member",
        invited_by: new mongoose.Types.ObjectId(currentUserId),
      }));

    // Create audit log
    const createAuditLog = () => [
      {
        action: "created_group_chat" as const,
        data: {},
        performedBy: new mongoose.Types.ObjectId(currentUserId),
      },
    ];

    // Create group chat
    const newGroupChat = await chatModel.create({
      name,
      description: description ?? "",
      createdBy: new mongoose.Types.ObjectId(currentUserId),
      isGroup: true,
      participants: generateParticipantEntries(),
      auditLogs: createAuditLog(),
    });

    if (!newGroupChat) {
      return next(
        new ApiError(
          "Unable to create group chat at the moment. Please try again later.",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    }

    res.status(HttpStatus.CREATED).json(
      new ApiResponse(HttpStatus.CREATED, "Group chat created successfully.", {
        chatId: newGroupChat._id,
      })
    );
  }
);

const renameGroupChat = asyncHandler(
  async (
    req: Request<{ chatId: string }, {}, IRenameGroupChatBody>,
    res: Response,
    next: NextFunction
  ) => {
    const validation = validateRequest(renameGroupChatSchema, req.body);

    if (!validation.success) {
      return next(
        new ApiError(
          "Invalid input: Group chat name is required and must meet the validation criteria.",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    const { chatId } = req.params;
    const { name: newChatName } = req.body;
    const authenticatedUserId = req.user._id.toString();

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return next(
        new ApiError("Invalid chat ID format.", HttpStatus.BAD_REQUEST)
      );
    }

    const existingChat = await chatModel.findById(chatId);

    if (!existingChat) {
      return next(
        new ApiError(
          "No chat found with the provided ID.",
          HttpStatus.NOT_FOUND
        )
      );
    }

    if (existingChat.createdBy.toString() !== authenticatedUserId) {
      return next(
        new ApiError(
          "Unauthorized: Only the creator of the chat can rename it.",
          HttpStatus.UNAUTHORIZED
        )
      );
    }

    await chatModel.findByIdAndUpdate(chatId, {
      name: newChatName,
      $push: {
        auditLogs: {
          action: "renamed_group_chat" as const,
          data: {
            old_name: existingChat.name,
            new_name: newChatName,
          },
          performedBy: new mongoose.Types.ObjectId(authenticatedUserId),
        },
      },
    });

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, "Chat name updated successfully."));
  }
);

const updateGroupChatDescription = asyncHandler(
  async (
    req: Request<{ chatId: string }, {}, IUpdateGroupChatDescriptionBody>,
    res: Response,
    next: NextFunction
  ) => {
    const validation = validateRequest(
      updateGroupChatDescriptionSchema,
      req.body
    );

    if (!validation.success) {
      return next(
        new ApiError(
          "Invalid input: Group chat description is required and must meet the validation criteria.",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    const { chatId } = req.params;
    const { description } = req.body;
    const authenticatedUserId = req.user._id.toString();

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return next(
        new ApiError("Invalid chat ID format.", HttpStatus.BAD_REQUEST)
      );
    }

    const existingChat = await chatModel.findById(chatId);

    if (!existingChat) {
      return next(
        new ApiError(
          "No chat found with the provided ID.",
          HttpStatus.NOT_FOUND
        )
      );
    }

    if (existingChat.createdBy.toString() !== authenticatedUserId) {
      return next(
        new ApiError(
          "Unauthorized: Only the creator of the chat can update it.",
          HttpStatus.UNAUTHORIZED
        )
      );
    }

    await chatModel.findByIdAndUpdate(chatId, {
      description,
      $push: {
        auditLogs: {
          action: "updated_group_chat_description" as const,
          data: {
            description: description,
          },
          performedBy: new mongoose.Types.ObjectId(authenticatedUserId),
        },
      },
    });

    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(HttpStatus.OK, "Chat description updated successfully.")
      );
  }
);

const deleteGroupChat = asyncHandler(
  async (
    _req: Request<{ chatId: string }>,
    _res: Response,
    _next: NextFunction
  ) => {}
);

const addParticipants = asyncHandler(
  async (
    req: Request<{ chatId: string }, {}, IAddParticipantsBody>,
    res: Response,
    next: NextFunction
  ) => {
    const validation = validateRequest(addParticipantsSchema, req.body);

    if (!validation.success) {
      return next(
        new ApiError(
          "Validation failed: Please provide a valid array of user IDs.",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    const { userIds: newParticipantIds } = req.body;
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return next(
        new ApiError(
          "Invalid Chat ID: The provided Chat ID is not valid.",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return next(
        new ApiError(
          "Chat not found: No chat exists with the given ID.",
          HttpStatus.NOT_FOUND
        )
      );
    }

    const isRequestingUserAdmin = chat.participants.some((participant) => {
      return (
        participant.user.toString() === req.user._id.toString() &&
        participant.role === "admin"
      );
    });

    if (!isRequestingUserAdmin) {
      return next(
        new ApiError(
          "Permission denied: Only chat admins can add new participants.",
          HttpStatus.UNAUTHORIZED
        )
      );
    }

    const areAllUserIdsValid = newParticipantIds.every((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (!areAllUserIdsValid) {
      return next(
        new ApiError(
          "Invalid User ID: One or more provided user IDs are not valid MongoDB ObjectIDs.",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    const hasDuplicateParticipants = newParticipantIds.some((id) => {
      return chat.participants.some(
        (participant) => participant.user.toString() === id
      );
    });

    if (hasDuplicateParticipants) {
      return next(
        new ApiError(
          "Duplicate users: Some of the specified users are already participants in this chat.",
          HttpStatus.BAD_REQUEST
        )
      );
    }

    await chatModel.findByIdAndUpdate(chatId, {
      $push: {
        participants: {
          $each: newParticipantIds.map((id) => ({
            user: new mongoose.Types.ObjectId(id),
            role: "member",
            invitedBy: new mongoose.Types.ObjectId(req.user._id),
          })),
        },
      },
    });

    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(
          HttpStatus.OK,
          "Participants have been successfully added to the chat."
        )
      );
  }
);

const removeParticipant = asyncHandler(
  async (
    _req: Request<{ chatId: string; userId: string }>,
    _res: Response
  ) => {}
);

const updateParticipantRole = asyncHandler(
  async (
    _req: Request<{ chatId: string; userId: string }>,
    _res: Response
  ) => {}
);

const getAllParticipants = asyncHandler(
  async (_req: Request<{ chatId: string }>, _res: Response) => {}
);

const getAuditLogs = asyncHandler(
  async (_req: Request<{ chatId: string }>, _res: Response) => {}
);

//  TEST ROUTE
const getAllChats = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const chats = await chatModel.find();

    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(HttpStatus.OK, "Chats successfully retrieved.", chats)
      );
  }
);

const deleteChatTest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return next(new ApiError("Invalid chat id.", HttpStatus.BAD_REQUEST));
    }

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return next(new ApiError("Chat not found.", HttpStatus.NOT_FOUND));
    }

    await chatModel.findByIdAndDelete(chatId);

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, "Chat successfully deleted."));
  }
);

const getCurrentUserChats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const chats = await ChatRoom.aggregate([
      {
        // Match chats where the current user is a participant
        $match: {
          participants: {
            $elemMatch: {
              user: new mongoose.Types.ObjectId(req.user._id),
            },
          },
        },
      },
      {
        // Project only required fields
        $project: {
          _id: 1,
          isGroup: 1,
          name: 1,
          unreadCount: 1,
          participants: 1,
          lastMessage: 1,
        },
      },
      {
        // Unwind participants array to process each participant separately
        $unwind: {
          path: "$participants",
        },
      },
      {
        // Lookup user details for each participant
        $lookup: {
          from: "users",
          localField: "participants.user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        // Unwind userData array to flatten the result
        $unwind: {
          path: "$userData",
        },
      },
      {
        // Project participant info with user details
        $project: {
          _id: 1,
          isGroup: 1,
          name: 1,
          unreadCount: 1,
          lastMessage: 1,
          participant: {
            _id: "$userData._id",
            username: "$userData.username",
            avatar: "$userData.avatar",
            role: "$participants.role",
          },
        },
      },
      {
        // Group back by chat, collecting all participants
        $group: {
          _id: "$_id",
          isGroup: { $first: "$isGroup" },
          name: { $first: "$name" },
          unreadCount: { $first: "$unreadCount" },
          participants: { $push: "$participant" },
          lastMessage: { $first: "$lastMessage" },
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          isGroup: 1,
          name: 1,
          unreadCount: 1,
          participants: 1,
          lastMessage: {
            _id: "$lastMessage._id",
            sender: "$lastMessage.sender",
            createdAt: "$lastMessage.createdAt",
            deliveryStatus: "$lastMessage.deliveryStatus",
            type: "$lastMessage.type",
            isDeleted: "$lastMessage.isDeleted",
            deletedFor: "$lastMessage.deletedFor",
            reactions: "$lastMessage.reactions",
            content: "$lastMessage.content",
          },
        },
      },
    ]);

    if (!chats) {
      return next(
        new ApiError(
          "Chats not found: No chats found for the user.",
          HttpStatus.NOT_FOUND
        )
      );
    }

    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(HttpStatus.OK, "Chats successfully retrieved.", chats)
      );
  }
);

const getRoomDetails = async (): Promise<IChatRoomDocument[]> => {
  try {
    const rooms = await ChatRoom.find()
      .select("_id name isGroup participants createdBy")
      .lean();
    return rooms;
  } catch (error) {
    throw error;
  }
};

export {
  createNewChatBetweenTwoUsers,
  getAllChats,
  createGroupChat,
  deleteChatTest,
  renameGroupChat,
  updateGroupChatDescription,
  deleteGroupChat,
  addParticipants,
  removeParticipant,
  updateParticipantRole,
  getAllParticipants,
  getAuditLogs,
  getCurrentUserChats,
  getRoomDetails,
};
