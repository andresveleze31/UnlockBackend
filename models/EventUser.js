import mongoose, { Schema } from "mongoose";

const eventUserSchema = new mongoose.Schema(
  {
    cedula: {
      type: Number,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    ciudad: {
      type: String,
      required: true,
    },
    telefono: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    estado: {
      type: String,
      enum: ["out", "in", "cancel", "expired"],
      default: "out",
      required: true,
    },
    validationToken: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

export const EventUser = mongoose.model("EventUser", eventUserSchema);
