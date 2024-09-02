import mongoose, { Schema } from "mongoose";

const companieSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    userRegistered: {
      type: Number,
      default: 0,
    },
    userLimit: {
      type: Number,
      default: 50,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const Companie = mongoose.model("Companie", companieSchema);
