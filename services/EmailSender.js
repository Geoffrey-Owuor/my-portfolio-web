//services/EmailSender.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function EmailSender({ to, subject, html }) {
  try {
    const mailOptions = {
      from: `"Portfolio Notifications" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email Sending failed:", error.message);
    return { success: false, error: error.message };
  }
}
