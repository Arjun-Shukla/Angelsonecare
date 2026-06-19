import { baseLayout, priorityBadge, infoTable, sectionHeading, ctaButton, divider } from './base.js';

/**
 * ticketRaisedTemplate — sent to admin and (if assigned) the leader.
 *
 * @param {object} ticket
 * @param {string} dashboardUrl - URL of the ticket management page
 */
export const ticketRaisedTemplate = ({
  ticket,
  dashboardUrl = 'http://localhost:5173/admin/tickets',
}) => {
  const {
    id,
    bookingId,
    clientName,
    clientEmail,
    clientPhone,
    service     = 'N/A',
    subject,
    category    = 'General',
    description,
    priority    = 'MEDIUM',
    status      = 'OPEN',
    createdAt,
  } = ticket;

  const ticketRows = [
    ['Ticket ID',  `#${id}`],
    ['Category',   category],
    ['Priority',   priority],
    ['Status',     status],
    ['Booking Ref', bookingId ? `#${bookingId}` : '—'],
    ['Raised At',  createdAt ? new Date(createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }) : '—'],
  ];

  const clientRows = [
    ['Client Name',  clientName  || '—'],
    ['Email',        clientEmail || '—'],
    ['Phone',        clientPhone || '—'],
    ['Service',      service],
  ];

  const priorityColors = {
    HIGH:   '#fee2e2',
    MEDIUM: '#fffbeb',
    LOW:    '#f0fdf4',
  };
  const alertBg = priorityColors[priority] ?? '#fffbeb';

  const bodyHtml = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
           style="margin-bottom:20px;">
      <tr>
        <td>
          <p style="margin:0;font-size:12px;color:#64748b;font-weight:600;
                     letter-spacing:1px;text-transform:uppercase;">Support Ticket</p>
          <h2 style="margin:4px 0 6px;font-size:22px;font-weight:800;color:#0f172a;
                      letter-spacing:-0.5px;">New Ticket Raised</h2>
          ${priorityBadge(priority)}
        </td>
        <td align="right" style="vertical-align:top;">
          <span style="display:inline-block;padding:6px 14px;background:#fef3c7;
                       border-radius:20px;font-size:13px;font-weight:700;
                       color:#92400e;">#${id}</span>
        </td>
      </tr>
    </table>

    <div style="background:${alertBg};border-radius:10px;padding:16px 20px;
                margin-bottom:24px;border-left:4px solid ${priority === 'HIGH' ? '#dc2626' : priority === 'LOW' ? '#16a34a' : '#d97706'};">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#1e293b;">Subject</p>
      <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.5;">${subject}</p>
    </div>

    ${sectionHeading('Ticket Details')}
    ${infoTable(ticketRows)}

    ${sectionHeading('Client Information')}
    ${infoTable(clientRows)}

    ${description ? `
    ${divider()}
    ${sectionHeading('Issue Description')}
    <div style="background:#f8fafc;border-radius:10px;padding:16px 20px;
                margin:8px 0 20px;font-size:13px;color:#475569;line-height:1.8;
                border-left:3px solid #64748b;white-space:pre-wrap;">
      ${description}
    </div>` : ''}

    ${divider()}
    <p style="margin:0 0 20px;font-size:13px;color:#64748b;line-height:1.6;">
      Please respond to this ticket promptly. High-priority tickets should be addressed within 2 hours.
    </p>
    <div style="text-align:center;">
      ${ctaButton('View & Respond to Ticket', dashboardUrl)}
    </div>
  `;

  const subject_line = `[${priority}] Ticket #${id} — ${subject}`;

  return {
    subject: subject_line,
    html: baseLayout({
      title: subject_line,
      previewText: `${priority} priority ticket from ${clientName}: "${subject}". Please review and respond.`,
      bodyHtml,
    }),
    text:
      `New Support Ticket\n` +
      `Ticket ID: #${id}\n` +
      `Priority: ${priority}\n` +
      `Subject: ${subject}\n` +
      `Category: ${category}\n` +
      `Client: ${clientName} (${clientPhone || clientEmail})\n` +
      `Service: ${service}\n` +
      (bookingId ? `Booking Ref: #${bookingId}\n` : '') +
      (description ? `\nDescription:\n${description}\n` : '') +
      `\nView ticket: ${dashboardUrl}`,
  };
};
