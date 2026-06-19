import { baseLayout, badge, infoTable, sectionHeading, ctaButton, divider } from './base.js';

/**
 * serviceCompletedTemplate — three variants, one for each recipient type.
 *
 * @param {object} booking     - full booking details
 * @param {'client'|'leader'|'admin'} recipientType
 * @param {string} clientUrl   - frontend base URL
 */
export const serviceCompletedTemplate = ({
  booking,
  recipientType = 'client',
  clientUrl     = 'http://localhost:5173',
}) => {
  const {
    id,
    service      = 'N/A',
    completionDate,
    startDate,
    endDate,
    client       = {},
    leader       = {},
    patient,
    amount,
  } = booking;

  const completedOn = completionDate
    ? new Date(completionDate).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })
    : endDate ?? '—';

  const summaryRows = [
    ['Booking ID',      `#${id}`],
    ['Service',         service],
    ['Start Date',      startDate || '—'],
    ['Completion Date', completedOn],
    ['Status',          `${badge('COMPLETED', '#d1fae5', '#065f46')}`],
    ['Amount',          amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '—'],
  ];

  // ── CLIENT EMAIL ──────────────────────────────────────────────────────────
  if (recipientType === 'client') {
    const firstName = client.name?.split(' ')[0] ?? 'there';
    const bodyHtml = `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="display:inline-block;width:64px;height:64px;
                    background:linear-gradient(135deg,#d1fae5,#a7f3d0);
                    border-radius:50%;line-height:64px;font-size:32px;">&#10003;</div>
        <h2 style="margin:16px 0 6px;font-size:24px;font-weight:800;color:#0f172a;">
          Service Completed!
        </h2>
        <p style="margin:0;font-size:14px;color:#64748b;">
          Your <strong>${service}</strong> service has been successfully completed.
        </p>
      </div>

      <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.7;">
        Dear ${firstName},<br><br>
        We're pleased to inform you that your healthcare service has been completed
        and verified. We hope you and your family received the best possible care.
      </p>

      ${sectionHeading('Service Summary')}
      ${infoTable(summaryRows)}

      ${divider()}

      <div style="background:linear-gradient(135deg,#eff6ff,#f0fdfa);border-radius:12px;
                  padding:24px;margin-bottom:28px;text-align:center;">
        <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#1e293b;">
          How was your experience?
        </p>
        <p style="margin:0 0 18px;font-size:13px;color:#64748b;line-height:1.6;">
          Your feedback helps us maintain the highest standard of care.
          It takes less than 60 seconds.
        </p>
        ${ctaButton('Leave a Review', `${clientUrl}/app/reviews`)}
      </div>

      ${divider()}
      <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;text-align:center;">
        Thank you for trusting Angels One Healthcare Services.<br>
        We look forward to serving you and your family again.
      </p>
    `;

    return {
      subject: `Service Completed — ${service} #${id} | Angels One`,
      html: baseLayout({
        title: `Service Completed — #${id}`,
        previewText: `Your ${service} service (Booking #${id}) has been successfully completed. Share your feedback!`,
        bodyHtml,
      }),
      text:
        `Service Completed — Angels One\n\n` +
        `Dear ${firstName},\n\n` +
        `Your ${service} service (Booking #${id}) has been successfully completed on ${completedOn}.\n\n` +
        `We would love to hear your feedback: ${clientUrl}/app/reviews\n\n` +
        `Thank you for trusting Angels One Healthcare Services.\n\n` +
        `— The Angels One Team`,
    };
  }

  // ── LEADER EMAIL ──────────────────────────────────────────────────────────
  if (recipientType === 'leader') {
    const leaderFirstName = leader.name?.split(' ')[0] ?? 'there';
    const bodyHtml = `
      <div style="text-align:center;margin-bottom:28px;">
        <div style="display:inline-block;width:64px;height:64px;
                    background:linear-gradient(135deg,#d1fae5,#a7f3d0);
                    border-radius:50%;line-height:64px;font-size:32px;">&#10003;</div>
        <h2 style="margin:16px 0 6px;font-size:24px;font-weight:800;color:#0f172a;">
          Service Confirmed Complete
        </h2>
        <p style="margin:0;font-size:14px;color:#64748b;">
          OTP verified — Booking <strong>#${id}</strong> is now closed.
        </p>
      </div>

      <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.7;">
        Dear ${leaderFirstName},<br><br>
        The client has verified the OTP and your service for
        <strong>${service}</strong> (Booking #${id}) has been officially marked as completed.
        Great work on delivering quality care!
      </p>

      ${sectionHeading('Completion Summary')}
      ${infoTable([
        ...summaryRows,
        ['Client', client.name || '—'],
        ['Patient', patient || '—'],
      ])}

      ${divider()}
      <p style="margin:0 0 20px;font-size:13px;color:#64748b;line-height:1.6;">
        This booking is now archived. You can view your performance in your leader portal.
      </p>
      <div style="text-align:center;">
        ${ctaButton('View in Leader Portal', `${clientUrl}/leader`)}
      </div>
    `;

    return {
      subject: `Service Completed — #${id} (${service})`,
      html: baseLayout({
        title: `Booking #${id} Completed`,
        previewText: `Booking #${id} for ${service} has been OTP-verified and closed. Well done!`,
        bodyHtml,
      }),
      text:
        `Service Completion Confirmed\n\n` +
        `Dear ${leaderFirstName},\n\n` +
        `Booking #${id} (${service}) has been marked complete after OTP verification on ${completedOn}.\n\n` +
        `Client: ${client.name}\n` +
        `Patient: ${patient}\n\n` +
        `View your portal: ${clientUrl}/leader\n\n` +
        `— The Angels One Team`,
    };
  }

  // ── ADMIN EMAIL ───────────────────────────────────────────────────────────
  const adminRows = [
    ...summaryRows,
    ['Client Name',  client.name  || '—'],
    ['Client Email', client.email || '—'],
    ['Leader Name',  leader.name  || '—'],
    ['Leader Email', leader.email || '—'],
    ['Patient',      patient      || '—'],
  ];

  const bodyHtml = `
    <h2 style="margin:0 0 6px;font-size:24px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
      Service Completion Report
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
      Booking <strong>#${id}</strong> has been OTP-verified and closed by the leader.
      All parties have been notified.
    </p>

    ${sectionHeading('Full Completion Summary')}
    ${infoTable(adminRows)}

    ${divider()}
    <div style="text-align:center;">
      ${ctaButton('View in Admin Panel', `${clientUrl}/admin/bookings`)}
    </div>
  `;

  return {
    subject: `[Admin] Service Completed — ${service} #${id}`,
    html: baseLayout({
      title: `[Admin] Booking #${id} Completed`,
      previewText: `Booking #${id} (${service}) has been completed and OTP-verified. Full summary inside.`,
      bodyHtml,
    }),
    text:
      `[Admin] Service Completion Summary\n\n` +
      `Booking #${id} — ${service}\n` +
      `Completed: ${completedOn}\n` +
      `Client: ${client.name} (${client.email})\n` +
      `Leader: ${leader.name} (${leader.email})\n` +
      `Amount: ₹${amount}\n\n` +
      `View details: ${clientUrl}/admin/bookings`,
  };
};
