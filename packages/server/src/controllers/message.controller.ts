import { type Request, type Response, type NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import mongoose from "mongoose";
import MessageModel from "../models/message.model";

const sendMessage = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message sent successfully."));
  }
);

const getMessages = asyncHandler(
  async (
    req: Request<
      { chatId: string },
      {},
      {},
      {
        page: number;
        limit: number;
        sortBy: "createdAt" | "updatedAt";
        sortOrder: "asc" | "desc";
        search: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) => {
    const { chatId } = req.params;
    let {
      page = "1",
      limit = "40",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    page = parseInt(page as string, 10);
    limit = parseInt(limit as string, 10);

    if (isNaN(page) || page < 1) {
      return next(
        new ApiResponse(400, "Invalid Page. Please provide a valid Page.")
      );
    }

    if (isNaN(limit) || limit < 1) {
      return next(
        new ApiResponse(400, "Invalid Limit. Please provide a valid Limit.")
      );
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.json(
        new ApiResponse(400, "Invalid Chat ID. Please provide a valid Chat ID.")
      );
    }

    const skip = (page - 1) * limit;

    const messages = await MessageModel.aggregate([
      // Get the messages from the chat
      {
        $match: {
          chat: new mongoose.Types.ObjectId(chatId),
        },
      },
      // Sort the messages
      {
        $sort: {
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        },
      },
      {
        $facet: {
          messages: [
            { $skip: skip },
            { $limit: limit },

            // Lookup sender
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
              },
            },

            // Lookup replyTo
            {
              $lookup: {
                from: "messages",
                localField: "replyTo",
                foreignField: "_id",
                as: "replyTo",
                pipeline: [{ $project: { _id: 1, content: 1 } }],
              },
            },
            {
              $addFields: {
                replyTo: {
                  $cond: {
                    if: { $gt: [{ $size: "$replyTo" }, 0] },
                    then: { $arrayElemAt: ["$replyTo", 0] },
                    else: null,
                  },
                },
              },
            },

            // Unwind sender
            { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },

            // Lookup seenBy users
            {
              $lookup: {
                from: "users",
                localField: "seenBy.user",
                foreignField: "_id",
                as: "seenByUsers",
              },
            },
            {
              $addFields: {
                seenBy: {
                  $map: {
                    input: "$seenBy",
                    as: "s",
                    in: {
                      $mergeObjects: [
                        {
                          seenAt: "$$s.seenAt",
                        },
                        {
                          $arrayElemAt: [
                            {
                              $map: {
                                input: {
                                  $filter: {
                                    input: "$seenByUsers",
                                    cond: { $eq: ["$$this._id", "$$s.user"] },
                                  },
                                },
                                as: "u",
                                in: {
                                  _id: "$$u._id",
                                  username: "$$u.username",
                                  avatar: "$$u.avatar",
                                  email: "$$u.email",
                                },
                              },
                            },
                            0,
                          ],
                        },
                      ],
                    },
                  },
                },
              },
            },

            // Final project
            {
              $project: {
                _id: 1,
                sender: { _id: 1, username: 1, avatar: 1 },
                deliveryStatus: 1,
                content: 1,
                createdAt: 1,
                replyTo: 1,
                type: 1,
                seenBy: 1,
              },
            },
          ],

          // Count for pagination
          totalMessages: [{ $count: "total" }],
        },
      },
      {
        $addFields: {
          totalMessages: {
            $ifNull: [{ $arrayElemAt: ["$totalMessages.total", 0] }, 0],
          },
        },
      },
      {
        $project: {
          messages: 1,
          totalMessages: 1,
          totalPages: {
            $ceil: { $divide: ["$totalMessages", limit] },
          },
        },
      },
    ]);

    if (messages.length == 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, "No messages found for this chat."));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Messages retrieved successfully.", messages[0])
      );
  }
);

const editMessage = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message edited successfully."));
  }
);

const deleteMessage = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message deleted successfully."));
  }
);

const markAsSeen = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message marked as seen successfully."));
  }
);

const reactToMessage = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message reacted successfully."));
  }
);

const pinMessage = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message pinned successfully."));
  }
);

const unpinMessage = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message unpinned successfully."));
  }
);

const addFavoriteMessage = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message added to favorites successfully."));
  }
);

const removeFavoriteMessage = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Message removed from favorites successfully.")
      );
  }
);

const uploadAttachment = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Attachment uploaded successfully."));
  }
);

const getCallLog = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Call log retrieved successfully."));
  }
);

export {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  markAsSeen,
  reactToMessage,
  pinMessage,
  unpinMessage,
  addFavoriteMessage,
  removeFavoriteMessage,
  uploadAttachment,
  getCallLog,
};
