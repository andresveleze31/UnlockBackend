import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createEvent, getEventsFromCompanie, getEvent } from "../controller/eventController.js";

const router = express.Router();
router.post("/create-event", protectRoute, createEvent );
router.get("/get-events-companie",protectRoute, getEventsFromCompanie);
router.get("/get-event/:id", protectRoute, getEvent);

export default router;
