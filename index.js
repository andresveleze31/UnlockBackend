import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import authUserRoutes from "./routes/authUserRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import eventUserRoutes from "./routes/eventUserRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/auth-user", authUserRoutes)
app.use("/api/event", eventRoutes);
app.use("/api/event-user", eventUserRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running in 3000");
});
