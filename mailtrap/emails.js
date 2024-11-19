import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.js";
import nodemailer from "nodemailer"

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verifica tu email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Error send verification", error);
    throw new Error("Error send verification", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "50689cc8-0ebb-42f8-83a5-eb369dffacc6",
      template_variables: {
        name: name,
        company_info_name: "Unlock",
      },
    });

    console.log("Email de bienvenida enviado exitosamente", response);
  } catch (error) {}
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Error sending password reset success email`, error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

export const sendRegistrationEmails = async (users) => {
  // Configura el transportador de nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail", // Cambia esto si usas otro servicio
    auth: {
      user: "unlocka74@gmail.com", // Tu dirección de correo
      pass: "wvio dpsf cpge cvil", // Tu contraseña de Gmail o contraseña de aplicación
    },
  });

  // URL de registro
  const registrationUrl = "https://unlock-front.onrender.com/register";

  // Recorre los usuarios y envía el correo a cada uno
  for (const user of users) {
    const emailOptions = {
      from: '"Tu Nombre o Empresa" <tu_correo@gmail.com>', // Remitente
      to: user.email, // Destinatario
      subject: "Regístrate en nuestra plataforma",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>¡Regístrate aquí!</h2>
          <p>Hola,</p>
          <p>Te invitamos a unirte a nuestra plataforma. Haz clic en el botón de abajo para completar tu registro:</p>
          <a href="${registrationUrl}" 
             style="display: inline-block; padding: 10px 15px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
            Completar Registro
          </a>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(emailOptions);
      console.log(`Email enviado a ${user.email}: ${info.response}`);
    } catch (error) {
      console.error(`Error enviando email a ${user.email}:`, error);
    }
  }
};