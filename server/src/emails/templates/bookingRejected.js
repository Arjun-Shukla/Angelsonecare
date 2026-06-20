import { baseLayout, infoTable, sectionHeading, ctaButton, divider } from './base.js';

/**
 * bookingRejectedTemplate — sent to the client when their booking is rejected.
 *
 * @param {object} params
 * @param {object} params.booking
 * @param {string} params.clientUrl - frontend base URL
 */
export const bookingRejectedTemplate = ({
  booking,
  clientUrl = 'http://localhost:5173',
}) => {
  const {
    id,
    service = 'N/A',
    rejectionReason = '',
    startDate,
    client = {},
  } = booking;

  const firstName = client.name?.split(' ')[0] ?? 'there';

  const bodyHtml = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;width:64px;height:64px;
                  background:linear-gradient(135deg,#fee2e2,#fecaca);
                  border-radius:50%;line-height:64px;font-size:28px;">&#10005;</div>
      <h2 style="margin:16px 0 6px;font-size:24px;font-weight:800;color:#0f172a;">
        Booking Not Approved
      </h2>
      <p style="margin:0;font-size:14px;color:#64748b;">
        We were unable to approve your <strong>${service}</strong> request at this time.
      </p>
    </div>

    <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.7;">
      Dear ${firstName},<br><br>
      Thank you for reaching out to Angels One Healthcare Services.
      After reviewing your booking request, we are unable to fulfil it at this time.
      We sincerely apologise for any inconvenience caused.
    </p>

    ${sectionHeading('Booking Details')}
    ${infoTable([
      ['Booking ID', `#${id}`],
      ['Service', service],
      ['Requested Date', startDate || '—'],
      ['Status', 'Not Approved'],
    ])}

    ${rejectionReason ? `
    ${divider()}
    ${sectionHeading('Reason')}
    <div style="background:#fef2f2;border-radius:10px;padding:14px 16px;
                margin:8px 0 20px;font-size:13px;color:#7f1d1d;line-height:1.7;
                border-left:3px solid #f87171;">
      ${rejectionReason}
    </div>` : ''}

    ${divider()}

    <div style="background:linear-gradient(135deg,#eff6ff,#f0fdfa);border-radius:12px;
                padding:24px;margin-bottom:28px;text-align:center;">
      <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#1e293b;">
        Still need care?
      </p>
      <p style="margin:0 0 18px;font-size:13px;color:#64748b;line-height:1.6;">
        You can submit a new booking request or contact our support team
        for personalised assistance.
      </p>
      ${ctaButton('Book Again', `${clientUrl}/app/book`)}
    </div>

    <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;text-align:center;">
      We hope to serve you better in the future.<br>
      — Angels One Healthcare Services
    </p>
  `;

  const subject = `Update on Your Booking #${id} — Angels One`;

  return {
    subject,
    html: baseLayout({
      title: subject,
      previewText: `Your ${service} booking request (Booking #${id}) could not be approved at this time.`,
      bodyHtml,
    }),
    text:
      `Booking Not Approved — Angels One\n\n` +
      `Dear ${firstName},\n\n` +
      `We were unable to approve your ${service} booking request (Booking #${id}).\n` +
      (rejectionReason ? `\nReason: ${rejectionReason}\n` : '') +
      `\nYou can submit a new booking: ${clientUrl}/app/book\n\n` +
      `We apologise for any inconvenience.\n\n` +
      `— Angels One Healthcare Services`,
  };
};
