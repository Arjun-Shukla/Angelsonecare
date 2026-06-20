import Booking from '../models/Booking.js';
import User    from '../models/User.js';
import Ticket  from '../models/Ticket.js';
import Review  from '../models/Review.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ROLES } from '../constants/roles.js';

// GET /api/analytics/dashboard
export const getDashboard = async (req, res) => {
  const [
    totalClients,
    totalLeaders,
    bookingsByStatus,
    totalRevenue,
    openTickets,
    avgRating,
  ] = await Promise.all([
    User.countDocuments({ role: ROLES.CLIENT, isActive: true }),
    User.countDocuments({ role: ROLES.LEADER }),
    Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Booking.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Ticket.countDocuments({ status: 'OPEN' }),
    Review.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]),
  ]);

  const statusMap = {};
  bookingsByStatus.forEach(b => { statusMap[b._id] = b.count; });

  const activeStatuses = ['ACCEPTED', 'IN_PROGRESS', 'COMPLETION_REQUESTED'];
  const activeServices = activeStatuses.reduce((s, k) => s + (statusMap[k] || 0), 0);

  sendSuccess(res, {
    data: {
      totalClients,
      totalLeaders,
      totalBookings:     Object.values(statusMap).reduce((s, n) => s + n, 0),
      pendingBookings:   statusMap['PENDING'] || 0,
      activeServices,
      completedServices: statusMap['COMPLETED'] || 0,
      rejectedBookings:  statusMap['REJECTED'] || 0,
      totalRevenue:      totalRevenue[0]?.total ?? 0,
      openTickets,
      avgRating:         +(avgRating[0]?.avg ?? 0).toFixed(1),
    },
  });
};

// GET /api/analytics/bookings?months=6
export const getBookings = async (req, res) => {
  const months = Math.min(parseInt(req.query.months, 10) || 6, 12);
  const now = new Date();

  // Build monthly buckets for the last N months
  const buckets = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return {
      year:  d.getFullYear(),
      month: d.getMonth() + 1,
      label: d.toLocaleString('en-IN', { month: 'short' }),
      count: 0,
    };
  });

  const since = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const raw = await Booking.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id:   { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
  ]);

  raw.forEach(r => {
    const bucket = buckets.find(b => b.year === r._id.year && b.month === r._id.month);
    if (bucket) bucket.count = r.count;
  });

  sendSuccess(res, { data: { bookings: buckets.map(b => ({ month: b.label, count: b.count })) } });
};

// GET /api/analytics/revenue?months=6
export const getRevenue = async (req, res) => {
  const months = Math.min(parseInt(req.query.months, 10) || 6, 12);
  const now = new Date();

  const buckets = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return {
      year:    d.getFullYear(),
      month:   d.getMonth() + 1,
      label:   d.toLocaleString('en-IN', { month: 'short' }),
      revenue: 0,
    };
  });

  const since = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  const [revenueRaw, serviceDistRaw] = await Promise.all([
    Booking.aggregate([
      { $match: { status: 'COMPLETED', completedAt: { $gte: since } } },
      {
        $group: {
          _id:     { year: { $year: '$completedAt' }, month: { $month: '$completedAt' } },
          revenue: { $sum: '$amount' },
        },
      },
    ]),
    Booking.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: '$service', count: { $sum: 1 }, revenue: { $sum: '$amount' } } },
      { $sort:  { count: -1 } },
    ]),
  ]);

  revenueRaw.forEach(r => {
    const bucket = buckets.find(b => b.year === r._id.year && b.month === r._id.month);
    if (bucket) bucket.revenue = r.revenue;
  });

  const SERVICE_COLORS = ['#3b82f6', '#0d9488', '#7c3aed', '#ea580c', '#16a34a', '#db2777'];
  const serviceDistribution = serviceDistRaw.map((s, i) => ({
    name:    s._id || 'Other',
    count:   s.count,
    revenue: s.revenue,
    color:   SERVICE_COLORS[i % SERVICE_COLORS.length],
  }));

  sendSuccess(res, {
    data: {
      revenue: buckets.map(b => ({ month: b.label, revenue: b.revenue })),
      serviceDistribution,
    },
  });
};
