import { baseLayout, ctaButton, divider } from './base.js';

const FEATURES = [
  { icon: '&#10003;', text: 'Verified & background-checked caregivers' },
  { icon: '&#10003;', text: 'OTP-secured service completion' },
  { icon: '&#10003;', text: '24/7 dedicated support team' },
  { icon: '&#10003;', text: 'Real-time booking management' },
];

export const welcomeTemplate = ({ name, clientUrl = 'http://localhost:5173' }) => {
  const firstName = name?.split(' ')[0] ?? 'there';

  const bodyHtml = `
    <h2 style="margin:0 0 6px;font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Welcome, ${firstName}! &#128075;
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
      Your Angels One account is all set. We're thrilled to have you with us.
    </p>

    <div style="background:linear-gradient(135deg,#eff6ff,#f0fdfa);border-radius:12px;
                padding:24px;margin-bottom:28px;border-left:4px solid #2563eb;">
      <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1e293b;">
        About Angels One Healthcare Services
      </p>
      <p style="margin:0;font-size:13px;color:#475569;line-height:1.7;">
        We connect families with verified, compassionate healthcare professionals
        for in-home nursing, elder care, post-surgery recovery, physiotherapy,
        and more — all from the comfort of your home.
      </p>
    </div>

    ${divider()}

    <p style="margin:0 0 14px;font-size:14px;font-weight:700;color:#1e293b;">
      What you get with Angels One:
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      ${FEATURES.map(
        ({ icon, text }) => `
        <tr>
          <td style="vertical-align:top;padding:5px 0;">
            <span style="display:inline-block;width:22px;height:22px;background:#dbeafe;
                         border-radius:50%;text-align:center;line-height:22px;
                         font-size:11px;color:#2563eb;font-weight:700;flex-shrink:0;">${icon}</span>
          </td>
          <td style="vertical-align:top;padding:5px 0 5px 10px;
                     font-size:13px;color:#475569;line-height:1.5;">
            ${text}
          </td>
        </tr>`
      ).join('')}
    </table>

    ${divider()}

    <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.7;">
      Ready to get started? Book your first service in just a few minutes.
    </p>
    <div style="text-align:center;margin-bottom:24px;">
      ${ctaButton('Book a Service Now', `${clientUrl}/book`)}
    </div>

    ${divider()}

    <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">
      Need help? Our support team is available Monday–Saturday, 8 AM to 8 PM.<br>
      Reply to this email or call us at <strong>+91 98100 00000</strong>.
    </p>
  `;

  return {
    subject: `Welcome to Angels One, ${firstName}! Your account is ready`,
    html: baseLayout({
      title: `Welcome to Angels One, ${firstName}!`,
      previewText: `Hi ${firstName}, your Angels One Healthcare account is ready. Start booking professional home care today.`,
      bodyHtml,
    }),
    text:
      `Welcome to Angels One Healthcare Services, ${name}!\n\n` +
      `Your account is set up and ready to use.\n\n` +
      `Visit ${clientUrl}/book to book your first service.\n\n` +
      `Need help? Contact us at support@angelsone.com or +91 98100 00000.\n\n` +
      `— The Angels One Team`,
  };
};
