import { EmailSender } from "@/services/EmailSender";
import { EmailTemplate } from "@/utils/EmailTemplate";
import { isEmail } from "@/utils/contactValidation";

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
      // Hitting Reply answers the visitor when they left an email address.
      replyTo: isEmail(contactInfo) ? contactInfo : undefined,
    });
  } catch (error) {
    console.error("Email sending error:", error);
  }
}
