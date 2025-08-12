import express from "express";
import verifyToken from "@/middlewares/auth.middleware";
import {
  addFavoriteMessage,
  deleteMessage,
  editMessage,
  getCallLog,
  getMessages,
  markAsSeen,
  pinMessage,
  reactToMessage,
  removeFavoriteMessage,
  sendMessage,
  unpinMessage,
  uploadAttachment,
} from "@/controllers/message.controller";

const router = express.Router();

router.post("/", verifyToken, sendMessage);

router.get("/:chatId", verifyToken, getMessages);

router.patch("/", verifyToken, editMessage);

router.delete("/", verifyToken, deleteMessage);

router.patch("/seen", verifyToken, markAsSeen);

router.patch("/react", verifyToken, reactToMessage);

router.patch("/pin", verifyToken, pinMessage);

router.patch("/unpin", verifyToken, unpinMessage);

router.patch("/favorite", verifyToken, addFavoriteMessage);

router.patch("/unfavorite", verifyToken, removeFavoriteMessage);

router.patch("/upload-attachment", verifyToken, uploadAttachment);

router.get("/call-log", verifyToken, getCallLog);

export default router;
