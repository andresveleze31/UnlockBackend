import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { addUserEvent, getUsersFromEvent, sendEmailsForRegister, getEventsUser } from "../controller/eventUserController.js";
import multer from "multer";
import { protectRouteUser } from "../middleware/protectRouteUser.js";

const upload = multer();

const router = express.Router();
router.post("/add-user", protectRoute, upload.single('file'), addUserEvent);
router.get("/users-event/:id", protectRoute, getUsersFromEvent);
router.post("/send-emails", protectRoute, sendEmailsForRegister);

router.get("/get-events-user", protectRouteUser, getEventsUser);

export default router;
