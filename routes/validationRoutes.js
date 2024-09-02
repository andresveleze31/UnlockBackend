import express from "express";
import { protectRouteUser } from "../middleware/protectRouteUser.js";
import { getMyValidation, validateTokenEvent } from "../controller/validationController.js";

const router = express.Router();

router.get("/get-my-validation/:id", protectRouteUser, getMyValidation);
router.post("/validate-token-event/:id", validateTokenEvent)

export default router;