import { baseLayout, badge, infoTable, sectionHeading, ctaButton, divider } from './base.js';

/**
 * bookingCreatedTemplate — sent to admin and (if assigned) the leader.
 *
 * @param {object} booking
 * @param {'admin'|'leader'} recipientType  - controls the heading copy
 * @param {string} dashboardUrl             - URL of the admin/leader panel
 */
export const bookingCreatedTemplate = ({
  booking,
  recipientType = 'admin',
  dashboardUrl  = 'http://localhost:5173/admin/bookings',
}) => {
  const {
    id,
    service    = 'N/A',
    status     = 'PENDING',
    startDate,
    endDate,
    shift,
    shiftTime,
    client     = {},
    patient,
    patientAge,
    gender,
    relationship,
    address,
    notes,
    amount,
  } = booking;

  const isLeader  = recipientType === 'leader';
  const heading   = isLeader ? 'New Service Assignment' : 'New Booking Request';
  const subHeading = isLeader
    ? 'A new booking has been assigned to you. Please review the details below.'
    : 'A client has submitted a new booking request. Review and assign a leader.';

  const clientRows = [
    ['Client Name',  client.name  || '—'],
    ['Email',        client.email || '—'],
    ['Phone',        client.phone || '—'],
  ];

  const patientRows = [
    ['Patient Name', patient || '—'],
    ['Age',          patientAge ? `${patientAge} years` : '—'],
    ['Gender',       gender || '—'],
    ['Relationship', relationship || '—'],
  ];

  const serviceRows = [
    ['Booking ID',  `#${id}`],
    ['Service',     service],
    ['Status',      status],
    ['Start Date',  startDate || '—'],
    ['End Date',    endDate   || '—'],
    ['Shift',       shift     || '—'],
    ['Shift Time',  shiftTime || '—'],
    ['Total Amount', amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '—'],
  ];

  const bodyHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
           style="margin-bottom:20px;">
      <tr>
        <td>
          <p style="margin:0;font-size:12px;color:#64748b;font-weight:600;
                     letter-spacing:1px;text-transform:uppercase;">Booking ID</p>
          <h2 style="margin:4px 0 0;font-size:24px;font-weight:800;color:#0f172a;
                      letter-spacing:-0.5px;">${heading}</h2>
        </td>
        <td align="right" style="vertical-align:top;">
          <span style="display:inline-block;padding:6px 14px;background:#dbeafe;
                       border-radius:20px;font-size:13px;font-weight:700;
                       color:#1d4ed8;letter-spacing:0.3px;">#${id}</span>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
      ${subHeading}
    </p>

    ${sectionHeading('Service Details')}
    ${infoTable(serviceRows)}

    ${sectionHeading('Client Information')}
    ${infoTable(clientRows)}

    ${sectionHeading('Patient Information')}
    ${infoTable(patientRows)}

    ${address ? `
    ${sectionHeading('Service Address')}
    <div style="background:#f8fafc;border-radius:10px;padding:14px 16px;
                margin:8px 0 20px;font-size:13px;color:#475569;line-height:1.7;
                border-left:3px solid #2563eb;">
      ${address}
    </div>` : ''}

    ${notes ? `
    ${divider()}
    ${sectionHeading('Special Instructions / Notes')}
    <div style="background:#fffbeb;border-radius:10px;padding:14px 16px;
                margin:8px 0 20px;font-size:13px;color:#78350f;line-height:1.7;
                border-left:3px solid #f59e0b;">
      ${notes}
    </div>` : ''}

    ${divider()}
    <div style="text-align:center;margin-top:8px;">
      ${ctaButton(isLeader ? 'View in Leader Portal' : 'Review Booking', dashboardUrl)}
    </div>
  `;

  const subject = `New Booking — ${service} | #${id}`;

  return {
    subject,
    html: baseLayout({
      title: subject,
      previewText: `New ${service} booking #${id} from ${client.name || 'a client'}. Please review and take action.`,
      bodyHtml,
    }),
    text:
      `New Booking Request\n` +
      `Booking ID: #${id}\n` +
      `Service: ${service}\n` +
      `Client: ${client.name} (${client.phone})\n` +
      `Patient: ${patient}\n` +
      `Dates: ${startDate} to ${endDate}\n` +
      `Address: ${address}\n` +
      (notes ? `Notes: ${notes}\n` : '') +
      `\nView details: ${dashboardUrl}`,
  };
};
