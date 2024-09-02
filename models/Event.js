import mongoose, { Schema } from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now, // Valor por defecto: fecha y hora actual
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: [
        "conferencia",
        "seminario",
        "feria",
        "exposicion",
        "arrendamiento",
        "concierto",
        "boda",
        "coorporativo",
        "curso",
        "otro",
      ], // Valores permitidos
      required: true,
    },
    tipoValidacion: {
      type: String,
      enum: [
        "qr",
        "barcode",
        "boton"
      ], // Valores permitidos
      required: true,
    },
    companieId: {
      type: Schema.Types.ObjectId,
      ref: "Companie",
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema)