import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function EmailSender({ to, subject, html, replyTo }) {
  try {
    const data = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>", // Use this for testing, or your verified domain
      to: to,
      subject: subject,
      html: html,
      ...(replyTo ? { replyTo } : {}),
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      return { success: false, error: data.error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email Sending failed:", error.message);
    return { success: false, error: error.message };
  }
}
