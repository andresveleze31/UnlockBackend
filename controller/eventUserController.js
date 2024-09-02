import xslx from "xlsx";
import { EventUser } from "../models/EventUser.js";

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
      };
    });

    await EventUser.insertMany(newJson);

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
