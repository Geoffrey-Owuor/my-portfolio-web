import { escapeHtml } from "./EmailTemplate";

// Security notice sent after the owner's password changes. Same table layout
// and inline styles as EmailTemplate, for email clients.
export function PasswordChangedEmail({ name, changedAt, ip }) {
  const greeting = name ? `Hi ${escapeHtml(name.split(" ")[0])},` : "Hi,";
  const when = escapeHtml(changedAt);
  const from = ip && ip !== "unknown" ? escapeHtml(ip) : "an unknown address";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your password was changed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f7">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" align="center"
          style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 32px 40px 24px 40px; border-bottom: 1px solid #e0e0e0;">
              <h1 style="font-size: 24px; font-weight: 600; color: #111827; margin: 0;">
                Your password was changed
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 40px;">
              <p style="font-size: 16px; line-height: 1.5; color: #374151; margin: 0 0 16px 0;">${greeting}</p>
              <p style="font-size: 16px; line-height: 1.5; color: #374151; margin: 0 0 16px 0;">
                The password for your portfolio's owner account was changed on
                <strong>${when}</strong> from ${from}. Every other device was signed out.
              </p>
              <p style="font-size: 16px; line-height: 1.5; color: #374151; margin: 0;">
                If this wasn't you, reset the password in the database right away
                and rotate <code>ACCESS_TOKEN_SECRET</code> and <code>REFRESH_TOKEN_SECRET</code>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e0e0e0;">
              <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">
                This email was automatically sent from your portfolio.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
