import express from "express";
import { signup, verifyEmail, login, logout, forgotPassword, resetPassword, checkAuth } from "../controller/authUserController.js";
import { protectRouteUser } from "../middleware/protectRouteUser.js";

const router = express.Router();

router.get("/check-auth", protectRouteUser, checkAuth);

router.post("/signup", signup);
router.post("/login", login)
router.post("/logout", logout)

router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)

router.post("/reset-password/:token", resetPassword)

export default router;