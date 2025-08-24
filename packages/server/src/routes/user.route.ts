import express from "express";
import {
  createNewUser,
  getAllUsers,
  getCurrentUser,
  getDirectConnections,
  getUserByUsernameQuery,
  loginUser,
  refreshAccessToken,
  verifyOtp,
} from "../controllers/user.controller";
import verifyToken from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/create", createNewUser);

router.post("/login", loginUser);

router.post("/verify-otp", verifyOtp);

router.post("/refresh-access-token", refreshAccessToken);

router.get("/current-user", verifyToken, getCurrentUser);

router.get("/get-users", verifyToken, getAllUsers);

router.get("/by-username", verifyToken, getUserByUsernameQuery);

router.get("/direct-connections", verifyToken, getDirectConnections);

export default router;
