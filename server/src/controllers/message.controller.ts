import { type Request, type Response, type NextFunction } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import mongoose from "mongoose";
import MessageModel from "@/models/message.model";

const sendMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message sent successfully."));
  }
);

const getMessages = asyncHandler(
  async (
    req: Request<{ chatId: string }, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.json(
        new ApiResponse(400, "Invalid Chat ID. Please provide a valid Chat ID.")
      );
    }

    const messages = await MessageModel.aggregate([
      {
        $match: {
          chat: new mongoose.Types.ObjectId(chatId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: "$sender",
      },
      {
        $project: {
          _id: 1,
          sender: {
            _id: 1,
            username: 1,
            avatar: 1,
          },
          content: 1,
          createdAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    if (messages.length == 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, "No messages found for this chat."));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Messages retrieved successfully.", messages));
  }
);

const editMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message edited successfully."));
  }
);

const deleteMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message deleted successfully."));
  }
);

const markAsSeen = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message marked as seen successfully."));
  }
);

const reactToMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message reacted successfully."));
  }
);

const pinMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message pinned successfully."));
  }
);

const unpinMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message unpinned successfully."));
  }
);

const addFavoriteMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Message added to favorites successfully."));
  }
);

const removeFavoriteMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Message removed from favorites successfully.")
      );
  }
);

const uploadAttachment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, "Attachment uploaded successfully."));
  }
);

const getCallLog = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
