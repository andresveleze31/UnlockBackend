import nodemailer from "nodemailer";
import QRCode from "qrcode";

export const sendQrCodeByEmail = async (
  token,
  recipientEmail,
  subject,
  message,
  senderEmail,
  senderPassword
) => {
  try {
    // Generar el código QR como Data URL
    const qrCodeUrl = await QRCode.toDataURL(token);
    // Configurar el transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Puedes usar cualquier otro servicio o configurar tu propio SMTP
      auth: {
        user: senderEmail, // Reemplaza con tu email
        pass: senderPassword, // Reemplaza con tu contraseña
      },
    });

    // Configurar el email
    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject: subject,
      html: `<p>${message}</p><p>Este es tu código QR generado:</p><img src="${qrCodeUrl}" alt="Código QR">`,
    };

    // Enviar el email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado:", info.response);

    console.log("Generando QR ------");
    return qrCodeUrl;
  } catch (error) {
    console.log(error);
  }
};
