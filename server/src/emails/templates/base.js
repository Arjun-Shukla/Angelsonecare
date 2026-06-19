// ─── Shared HTML building blocks ─────────────────────────────────────────────

export const badge = (text, bgColor = '#dbeafe', textColor = '#1d4ed8') =>
  `<span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:0.5px;background-color:${bgColor};color:${textColor};">${text}</span>`;

export const priorityBadge = (priority = 'MEDIUM') => {
  const map = {
    HIGH:   { bg: '#fee2e2', color: '#dc2626' },
    MEDIUM: { bg: '#fef3c7', color: '#d97706' },
    LOW:    { bg: '#d1fae5', color: '#059669' },
  };
  const { bg, color } = map[priority] ?? map.MEDIUM;
  return badge(priority, bg, color);
};

export const statusBadge = (status = 'PENDING') => {
  const map = {
    ACTIVE:    { bg: '#d1fae5', color: '#059669' },
    PENDING:   { bg: '#fef3c7', color: '#d97706' },
    COMPLETED: { bg: '#dbeafe', color: '#1d4ed8' },
    CANCELLED: { bg: '#f1f5f9', color: '#64748b' },
  };
  const { bg, color } = map[status] ?? map.PENDING;
  return badge(status, bg, color);
};

export const ctaButton = (text, url) =>
  `<a href="${url}" target="_blank"
     style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#2563eb,#0d9488);
            color:#ffffff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:700;
            letter-spacing:0.3px;margin-top:8px;"
  >${text}</a>`;

export const divider = () =>
  `<hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">`;

export const infoTable = (rows) =>
  `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
          style="border-collapse:collapse;background:#f8fafc;border-radius:10px;overflow:hidden;margin:20px 0;">
     ${rows
       .map(
         ([label, value]) =>
           `<tr>
              <td style="padding:10px 16px;font-size:13px;color:#64748b;font-weight:600;white-space:nowrap;
                         border-bottom:1px solid #e2e8f0;width:38%;">${label}</td>
              <td style="padding:10px 16px;font-size:13px;color:#1e293b;
                         border-bottom:1px solid #e2e8f0;">${value ?? '—'}</td>
            </tr>`
       )
       .join('')}
   </table>`;

export const sectionHeading = (text) =>
  `<p style="margin:24px 0 8px;font-size:12px;font-weight:700;color:#64748b;
             letter-spacing:1.5px;text-transform:uppercase;">${text}</p>`;

// ─── Base HTML layout ─────────────────────────────────────────────────────────

export const baseLayout = ({
  title,
  previewText = '',
  bodyHtml,
  supportEmail = 'support@angelsone.com',
  supportPhone = '+91 98100 00000',
}) => `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;word-spacing:normal;
             font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <!-- Inbox preview text (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;color:#f1f5f9;font-size:1px;">
    ${previewText}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
         style="background-color:#f1f5f9;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
               style="width:100%;max-width:600px;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8 0%,#0f766e 100%);
                        border-radius:16px 16px 0 0;padding:32px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding-right:14px;vertical-align:middle;">
                    <div style="width:46px;height:46px;background:rgba(255,255,255,0.18);
                                border-radius:12px;text-align:center;line-height:46px;font-size:22px;">
                      &#10084;&#65039;
                    </div>
                  </td>
                  <td style="vertical-align:middle;">
                    <p style="margin:0;color:#ffffff;font-size:20px;font-weight:800;
                               letter-spacing:-0.5px;line-height:1.2;">Angels One</p>
                    <p style="margin:3px 0 0;color:rgba(255,255,255,0.65);font-size:10px;
                               letter-spacing:3px;text-transform:uppercase;font-weight:600;">
                      Healthcare Services
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="background:#ffffff;padding:40px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#f8fafc;border-radius:0 0 16px 16px;
                        border-top:1px solid #e2e8f0;padding:28px 40px;">
              <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;line-height:1.8;">
                <strong style="color:#64748b;">Angels One Healthcare Services</strong><br>
                &#128231; ${supportEmail} &nbsp;&bull;&nbsp; &#128222; ${supportPhone}
              </p>
              <p style="margin:10px 0 0;color:#cbd5e1;font-size:11px;text-align:center;">
                Professional care, right at home.
              </p>
              <p style="margin:14px 0 0;color:#e2e8f0;font-size:10px;text-align:center;line-height:1.6;">
                You received this email because you are registered with Angels One Healthcare Services.<br>
                If you did not request this, please contact our support team.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
