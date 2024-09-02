import { Event } from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    event.companieId = req.companieId;
    await event.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getEventsFromCompanie = async (req, res) => {
  try {
    const events = await Event.find({ companieId: req.companieId });

    if (!events) {
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

export const getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id });

    if (!event) {
      return res.status(400).json({
        success: false,
        message: "Evento no encontrado",
      });
    }

    res.status(201).json({
      success: true,
      message: "Evento Encontrado",
      event,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};




