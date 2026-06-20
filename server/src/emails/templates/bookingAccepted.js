import { baseLayout, infoTable, sectionHeading, ctaButton, divider } from './base.js';

/**
 * bookingAcceptedTemplate — sent to the client when their booking is accepted.
 *
 * @param {object} params
 * @param {object} params.booking
 * @param {string} params.clientUrl - frontend base URL
 */
export const bookingAcceptedTemplate = ({
  booking,
  clientUrl = 'http://localhost:5173',
}) => {
  const {
    id,
    service = 'N/A',
    startDate,
    endDate,
    shift,
    shiftTime,
    leader = {},
    client = {},
  } = booking;

  const firstName = client.name?.split(' ')[0] ?? 'there';

  const rows = [
    ['Booking ID', `#${id}`],
    ['Service', service],
    ['Status', 'Accepted'],
    ['Start Date', startDate || '—'],
    ['End Date', endDate || '—'],
    ['Shift', shift || '—'],
    ['Shift Time', shiftTime || '—'],
  ];

  if (leader?.name) rows.push(['Assigned Caregiver', leader.name]);

  const bodyHtml = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;width:64px;height:64px;
                  background:linear-gradient(135deg,#d1fae5,#a7f3d0);
                  border-radius:50%;line-height:64px;font-size:28px;">&#10003;</div>
      <h2 style="margin:16px 0 6px;font-size:24px;font-weight:800;color:#0f172a;">
        Booking Accepted!
      </h2>
      <p style="margin:0;font-size:14px;color:#64748b;">
        Your <strong>${service}</strong> service has been confirmed.
      </p>
    </div>

    <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.7;">
      Dear ${firstName},<br><br>
      Great news! Your booking has been reviewed and accepted by our team.
      ${leader?.name ? `<strong>${leader.name}</strong> has been assigned as your caregiver.` : 'A caregiver will be assigned to you shortly.'}
      We will keep you updated every step of the way.
    </p>

    ${sectionHeading('Booking Confirmation')}
    ${infoTable(rows)}

    ${divider()}

    <div style="text-align:center;margin-top:8px;">
      ${ctaButton('View Booking Details', `${clientUrl}/app/bookings/${id}`)}
    </div>

    <p style="margin:20px 0 0;font-size:13px;color:#94a3b8;line-height:1.7;text-align:center;">
      Thank you for choosing Angels One Healthcare Services.<br>
      We are committed to providing the best care for you and your family.
    </p>
  `;

  const subject = `Booking Confirmed — ${service} #${id} | Angels One`;

  return {
    subject,
    html: baseLayout({
      title: subject,
      previewText: `Your ${service} booking #${id} has been accepted. ${leader?.name ? `${leader.name} will be your caregiver.` : ''}`,
      bodyHtml,
    }),
    text:
      `Booking Accepted — Angels One\n\n` +
      `Dear ${firstName},\n\n` +
      `Your ${service} booking (Booking #${id}) has been accepted.\n` +
      (leader?.name ? `Assigned Caregiver: ${leader.name}\n` : '') +
      `\nStart Date: ${startDate || '—'}\n` +
      `\nView your booking: ${clientUrl}/app/bookings/${id}\n\n` +
      `Thank you for choosing Angels One Healthcare Services.\n\n` +
      `— The Angels One Team`,
  };
};
