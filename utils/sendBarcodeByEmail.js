import bwipjs from "bwip-js"
import nodemailer from "nodemailer";
const generateBarcodeBuffer = async (data) => {
    try {
      const buffer = await bwipjs.toBuffer({
        bcid:        'code128',   // Tipo de código de barras
        text:        data,        // Datos para el código de barras
        scale:       3,           // Escala de la imagen
        height:      10,          // Altura en milímetros
        includetext: true,        // Incluir texto bajo el código de barras
        textxalign:  'center',    // Alineación del texto
      });
      return buffer;
    } catch (error) {
      console.error('Error al generar el código de barras:', error);
      throw error;
    }
  };

export const sendBarcodeByEmail = async(data, recipientEmail, subject, message, senderEmail, senderPassword) => {
    try {
      // Genera el buffer del código de barras
      const barcodeBuffer = await generateBarcodeBuffer(data);
  
      // Configurar el transporte de nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail", // Puedes usar cualquier otro servicio o configurar tu propio SMTP
        auth: {
          user: senderEmail,
          pass: senderPassword,
        },
      });
  
      // Configurar el email
      const mailOptions = {
        from: senderEmail,
        to: recipientEmail,
        subject: subject,
        text: message,
        attachments: [
          {
            filename: 'barcode.png',
            content: barcodeBuffer,
            encoding: 'base64'
          },
        ],
      };
  
      // Enviar el email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email enviado:", info.response);
    } catch (error) {
      console.error("Error al enviar el email:", error);
    }
  };