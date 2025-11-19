//services/EmailSender.js
// This version uses nodemailer to send an email
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
  connectionTimeout: 5000, // Give up if can't connect in 5 seconds
  greetingTimeout: 5000, // Give up if Gmail doesn't say "Hello" in 5 seconds
  socketTimeout: 5000, // Give up if data transfer stalls
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

// services/EmailSender.js
//This version uses resend to send an email
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function EmailSender({ to, subject, html }) {
//   try {
//     const data = await resend.emails.send({
//       from: "Portfolio <onboarding@resend.dev>", // Use this for testing, or your verified domain
//       to: to,
//       subject: subject,
//       html: html,
//     });

//     if (data.error) {
//       console.error("Resend API Error:", data.error);
//       return { success: false, error: data.error };
//     }

//     return { success: true, data };
//   } catch (error) {
//     console.error("Email Sending failed:", error.message);
//     return { success: false, error: error.message };
//   }
// }
