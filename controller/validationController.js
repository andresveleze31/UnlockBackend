import { EventUser } from "../models/EventUser.js";
import { User } from "../models/User.js";
import { sendBarcodeByEmail } from "../utils/sendBarcodeByEmail.js";
import { sendQrCodeByEmail } from "../utils/sendQrByEmail.js";

export const getMyValidation = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const event = await EventUser.findOne({
      eventId: req.params.id,
      email: user.email,
    }).populate("eventId");

    if (!event) {
      return res.status(400).json({
        success: false,
        message: "Usuario no registrado al evento",
      });
    }

    if (event.eventId.tipoValidacion == "qr") {
      const qr = await sendQrCodeByEmail(
        event.validationToken,
        user.email,
        "Envio de Validacion QR - Evento",
        "Envio QR",
        "unlocka74@gmail.com",
        process.env.NODEMAILER_PASSWORD
      );
      console.log(qr);
      return res.status(200).json({
        success: true,
        message: "Validacion Generada Correctamente",
        qr,
      });
    } else if (event.eventId.tipoValidacion == "barcode") {
      await sendBarcodeByEmail(
        event.validationToken,
        user.email,
        "Envio de Validacion Barcode - Evento",
        "Envio Barcode",
        "unlocka74@gmail.com",
        process.env.NODEMAILER_PASSWORD
      );
      return res.status(200).json({
        success: true,
        message: "Codigo de barras enviado correctamente",
      });
    } else if (event.eventId.tipoValidacion == "boton") {
      return res.status(200).json({
        success: true,
        message: "Boton Creado Exitosamente",
        validation: event.validationToken,
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const validateTokenEvent = async (req, res) => {
  try {
    const { validationToken } = req.body;
    const event = await EventUser.findOne({
      eventId: req.params.id,
      validationToken: validationToken,
    });

    if (!event) {
      return res.status(400).json({
        success: false,
        message: "No esta permitido su ingreso al evento",
      });
    }

    console.log(event);

    if (event.estado == "cancel") {
      return res.status(400).json({
        success: false,
        message: "No esta permitido su ingreso al evento fue cancelado",
      });
    }

    if (event.estado == "out") {
      event.estado = "in";
      await event.save();
      return res.status(200).json({
        success: true,
        message: "Ingresando al evento",
      });
    }

    if (event.estado == "in") {
      event.estado = "out";
      await event.save();
      return res.status(200).json({
        success: true,
        message: "Saliendo del evento",
      });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
