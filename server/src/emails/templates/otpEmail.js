import { baseLayout, infoTable, sectionHeading, divider } from './base.js';

/**
 * otpEmailTemplate — sent to the client when a leader or admin requests
 * service completion. The client shares this OTP with the leader to verify.
 *
 * @param {object} params
 * @param {string} params.clientName
 * @param {string} params.otp          - plain-text 6-digit OTP
 * @param {string} params.bookingId
 * @param {string} params.service
 * @param {number} params.expiryMinutes
 */
export const otpEmailTemplate = ({
  clientName,
  otp,
  bookingId,
  service = 'Healthcare Service',
  expiryMinutes = 10,
}) => {
  const firstName = clientName?.split(' ')[0] ?? 'there';

  const bodyHtml = `
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Service Completion Code
    </h2>
    <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.6;">
      Dear ${firstName}, your caregiver has marked the service as complete.
      Please share the OTP below with them to confirm service delivery.
    </p>

    <!-- OTP display box -->
    <div style="background:linear-gradient(135deg,#eff6ff,#f0fdfa);border-radius:16px;
                padding:32px 24px;margin:0 0 28px;text-align:center;
                border:2px dashed #93c5fd;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#6b7280;
                 letter-spacing:2px;text-transform:uppercase;">Your One-Time Password</p>
      <div style="display:inline-block;background:#fff;border-radius:12px;
                  padding:16px 40px;box-shadow:0 4px 12px rgba(37,99,235,0.15);
                  border:1px solid #dbeafe;">
        <span style="font-size:40px;font-weight:800;color:#1d4ed8;letter-spacing:12px;
                      font-family:'Courier New',Courier,monospace;">${otp}</span>
      </div>
      <p style="margin:14px 0 0;font-size:12px;color:#ef4444;font-weight:600;">
        &#9201; Expires in ${expiryMinutes} minutes
      </p>
    </div>

    ${sectionHeading('Booking Details')}
    ${infoTable([
      ['Booking ID', `#${bookingId}`],
      ['Service', service],
      ['Status', 'Completion Requested'],
    ])}

    ${divider()}

    <div style="background:#fefce8;border-radius:10px;padding:14px 16px;
                margin:0 0 20px;border-left:3px solid #f59e0b;">
      <p style="margin:0;font-size:13px;color:#78350f;line-height:1.7;">
        <strong>Important:</strong> Share this OTP only with your assigned caregiver
        to confirm they completed the service. Do not share it with anyone else.
        This code expires in <strong>${expiryMinutes} minutes</strong>.
      </p>
    </div>

    <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;text-align:center;">
      If you did not request this or the service is not complete,
      please contact Angels One support immediately.
    </p>
  `;

  const subject = `Your Completion OTP — ${service} #${bookingId}`;

  return {
    subject,
    html: baseLayout({
      title: subject,
      previewText: `Your OTP for completing service #${bookingId} is ${otp}. Valid for ${expiryMinutes} minutes.`,
      bodyHtml,
    }),
    text:
      `Service Completion OTP — Angels One\n\n` +
      `Dear ${firstName},\n\n` +
      `Your caregiver has requested service completion for Booking #${bookingId} (${service}).\n\n` +
      `Your OTP: ${otp}\n\n` +
      `This code expires in ${expiryMinutes} minutes. Share it only with your assigned caregiver.\n\n` +
      `— The Angels One Team`,
  };
};
