export function EmailTemplate(contactInfo, message) {
  const portfolioName = "Jeff's Portfolio"; // You can change this
  const greeting = "Hi Jeff,";
  const intro =
    "You've received a new message from your portfolio contact form.";
  const footerText = "This email was automatically sent from your portfolio.";

  // --- HTML Email Template Starts Here ---
  // We use inline CSS and tables for maximum compatibility.
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>New Portfolio Message</title>
  <style>
    /* Basic reset for email clients */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    body { margin: 0; padding: 0; }
    
    /* Responsive-ish styles for email */
    @media screen and (max-width: 600px) {
      .content-table {
        width: 100% !important;
        max-width: 100% !important;
      }
      .content-cell {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f7">
    <tr>
      <td align="center" style="padding: 20px 0;">
        
        <table
          width="600"
          class="content-table"
          border="0"
          cellspacing="0"
          cellpadding="0"
          align="center"
          style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;"
        >
          
          <tr>
            <td
              class="content-cell"
              style="padding: 32px 40px 24px 40px; border-bottom: 1px solid #e0e0e0;"
            >
              <h1 style="font-size: 24px; font-weight: 600; color: #111827; margin: 0;">
                New Message from ${portfolioName}
              </h1>
            </td>
          </tr>
          
          <tr>
            <td class="content-cell" style="padding: 32px 40px;">
              <p style="font-size: 16px; line-height: 1.5; color: #374151; margin: 0 0 24px 0;">
                ${greeting}
              </p>
              <p style="font-size: 16px; line-height: 1.5; color: #374151; margin: 0 0 24px 0;">
                ${intro}
              </p>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px 8px 0 0;">
                    <strong style="font-size: 14px; color: #374151;">Contact Info:</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px; border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 8px 8px;">
                    <p style="font-size: 16px; color: #111827; margin: 0;">
                      ${contactInfo}
                    </p>
                  </td>
                </tr>
              </table>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <strong style="font-size: 14px; color: #374151;">Message:</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <p style="font-size: 16px; line-height: 1.5; color: #1f2937; margin: 0; white-space: pre-wrap;">${message}</p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <tr>
            <td
              class="content-cell"
              style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e0e0e0;"
            >
              <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">
                ${footerText}
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
