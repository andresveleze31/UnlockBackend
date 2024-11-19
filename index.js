import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import authUserRoutes from "./routes/authUserRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import eventUserRoutes from "./routes/eventUserRoutes.js";
import validationRoutes from "./routes/validationRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin:["http://localhost:5173", "https://unlock-front.onrender.com"], // Cambia a tu URL del frontend
  credentials: true, // Permite el envío de cookies
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/auth-user", authUserRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/event-user", eventUserRoutes);
app.use("/api/validation", validationRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running in 3000");
});
