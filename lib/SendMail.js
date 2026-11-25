import { EmailSender } from "@/services/EmailSender";
import { EmailTemplate } from "@/utils/EmailTemplate";
import { PasswordChangedEmail } from "@/utils/PasswordChangedEmail";
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

// A failed notice is logged, never thrown: the password has already changed.
export async function sendPasswordChangedNotice({ to, name, ip }) {
  const changedAt = `${new Date().toUTCString().replace("GMT", "UTC")}`;
  const result = await EmailSender({
    to,
    subject: "Your portfolio password was changed",
    html: PasswordChangedEmail({ name, changedAt, ip }),
  });
  if (!result.success) {
    console.error("Password-change notice wasn't sent:", result.error);
  }
}
