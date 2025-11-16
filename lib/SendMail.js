import { EmailSender } from "@/services/EmailSender";
import { EmailTemplate } from "@/utils/EmailTemplate";

export async function sendMail({ contactInfo, message }) {
  // Generate the email template
  const emailHtml = EmailTemplate(contactInfo, message);

  // Email to send to
  const recipientEmail = process.env.RECIPIENT_EMAIL;

  try {
    //Send the email
    await EmailSender({
      to: recipientEmail,
      subject: "NEW PORTFOLIO NOTIFICATION",
      html: emailHtml,
    });
  } catch (error) {
    console.error("Email sending error:", error);
  }
}
