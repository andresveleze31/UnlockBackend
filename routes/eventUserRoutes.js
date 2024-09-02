import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { addUserEvent } from "../controller/eventUserController.js";

const router = express.Router();
router.post("/add-user", protectRoute, addUserEvent );

export default router;
