import express from "express";
import {
  addParticipants,
  createGroupChat,
  createNewChatBetweenTwoUsers,
  deleteChatTest,
  getAllChats,
  getAllParticipants,
  getAuditLogs,
  getCurrentUserChats,
  removeParticipant,
  renameGroupChat,
  updateGroupChatDescription,
  updateParticipantRole,
} from "@/controllers/chat.controller";
import verifyToken from "@/middlewares/auth.middleware";

const router = express.Router();

// Chat Management [Create, Rename, Update, Delete]

router.post("/", verifyToken, createNewChatBetweenTwoUsers);

router.get("/", verifyToken, getCurrentUserChats);

router.post("/group", verifyToken, createGroupChat);

router.patch("/:chatId/name", verifyToken, renameGroupChat);

router.patch("/:chatId/description", verifyToken, updateGroupChatDescription);

// Participants / Roles

router.patch("/:chatId/participants", verifyToken, addParticipants);

router.patch("/:chatId/participants/:userId", verifyToken, removeParticipant);

router.patch("/:chatId/roles/:userId", verifyToken, updateParticipantRole);

router.get("/:chatId/participants", verifyToken, getAllParticipants);

// Audit Logs

router.get("/:chatId/audit-logs", verifyToken, getAuditLogs);

// Settings

// TEST ROUTES
router.delete("/delete-chat-test/:chatId", verifyToken, deleteChatTest);

export default router;
