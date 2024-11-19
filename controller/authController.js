import { Companie } from "../models/Companie.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("Por favor llena todos los campos");
    }

    const userExits = await Companie.findOne({ email });

    if (userExits) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationCode();
    const companie = new Companie({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await companie.save();

    //jwt
    const token = generateTokenAndSetCookie(res, companie._id);

    await sendVerificationEmail(companie.email, verificationToken);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      companie: {
        ...companie._doc,
        password: undefined,
      },
      token
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  ////
  const { code } = req.body;

  try {
    const companie = await Companie.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!companie) {
      return res.status(400).json({
        sucess: false,
        message: "Codigo de verificacion invalido o a expirado",
      });
    }

    companie.isVerified = true;
    companie.verificationToken = undefined;
    companie.verificationTokenExpiresAt = undefined;
    await companie.save();

    await sendWelcomeEmail(companie.email, companie.name);

    res.status(200).json({
      success: true,
      message: "Email verificado exitosamente",
      companie: {
        ...companie._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const companie = await Companie.findOne({ email });

    if (!companie) {
      return res
        .status(400)
        .json({ success: false, message: "Credenciales Invalidas" });
    }

    const isPasswordValid = await bcrypt.compare(password, companie.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Credenciales Invalidas" });
    }

    const token = generateTokenAndSetCookie(res, companie._id);

    companie.lastLogin = new Date();
    await companie.save();

    res.status(201).json({
      success: true,
      message: "Companie created successfully",
      companie: {
        ...companie._doc,
        password: undefined,
      },
      token
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const companie = await Companie.findOne({ email });

    if (!companie) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    companie.resetPasswordToken = resetToken;
    companie.resetPasswordExpiresAt = resetTokenExpiresAt;

    await companie.save();

    await sendPasswordResetEmail(
      companie.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Link de reseteo enviado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const companie = await Companie.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!companie) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    companie.password = hashedPassword;
    companie.resetPasswordToken = undefined;
    companie.resetPasswordExpiresAt = undefined;

    await companie.save();

    await sendResetSuccessEmail(companie.email);
    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ success: true, message: "Sesion cerrada correctamente" });
};

export const checkAuth = async (req, res) => {
  try {
    const companie = await Companie.findById(req.companieId).select("-password");

    if (!companie) {
      return res
        .status(400)
        .json({ success: false, message: "Compañia no encontrada" });
    }

    res.status(200).json({success: true, companie})

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });

  }
};
