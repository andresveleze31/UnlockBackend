import xslx from "xlsx";
import { EventUser } from "../models/EventUser.js";
import { User } from "../models/User.js";
import { generateValidationToken } from "../utils/generateValidationToken.js";
import { Companie } from "../models/Companie.js";

export const addUserEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const file = req.file;
    console.log(file);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "El archivo no se envio correctamente",
      });
    }

    const workbook = xslx.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convertir los datos de la hoja de Excel a JSON
    const jsonData = xslx.utils.sheet_to_json(sheet);

    const newJson = jsonData.map((user) => {
      return {
        ...user,
        eventId,
        validationToken: generateValidationToken(),
      };
    });

    const companie = await Companie.findOne({ _id: req.companieId });

    if (!companie) {
      return res.status(400).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const allowUsers = companie.userLimit - companie.userRegistered;

    if (newJson.length > allowUsers) {
      return res.status(400).json({
        success: false,
        message: "No puede registrar la cantidad solicitada, actualice su plan",
      });
    }

    companie.userRegistered = companie.userRegistered + newJson.length;

    await EventUser.insertMany(newJson);
    await companie.save();

    res.status(200).json({
      success: true,
      message: "Asistentes agregados correctamente",
      newJson,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getUsersFromEvent = async (req, res) => {
  try {
    const users = await EventUser.find({ eventId: req.params.id });

    if (!users) {
      return res.status(400).json({
        success: false,
        message: "No hay usuarios registrados al evento",
      });
    }

    res.status(201).json({
      success: true,
      message: "Usuarios encontrados",
      users,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const sendEmailsForRegister = async (req, res) => {

};

export const getEventsUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Usuario no valido",
      });
    }
    const events = await EventUser.find({ email: user.email });

    if (!events || events.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Eventos no encontrados",
      });
    }

    res.status(201).json({
      success: true,
      message: "Eventos Encontrados",
      events,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
