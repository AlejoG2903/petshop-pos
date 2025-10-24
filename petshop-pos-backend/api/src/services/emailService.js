import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendReportEmail(to, subject, text, attachmentPath) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Petshop POS" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    attachments: [
      {
        filename: attachmentPath.split("/").pop(),
        path: attachmentPath,
      },
    ],
  });

  console.log("📤 Correo enviado:", info.messageId);
}
