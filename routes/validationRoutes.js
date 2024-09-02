import express from "express";
import { protectRouteUser } from "../middleware/protectRouteUser.js";
import { getMyValidation } from "../controller/validationController.js";

const router = express.Router();

router.get("/get-my-validation/:id", protectRouteUser, getMyValidation);

export default router;