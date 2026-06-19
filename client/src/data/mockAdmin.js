export const MOCK_ADMIN = {
  name: 'Rajesh Angels',
  email: 'admin@angelsone.com',
  phone: '+91 98100 00001',
  role: 'ADMIN',
};

export const MOCK_PLATFORM_STATS = {
  totalBookings: 1247,
  activeServices: 43,
  monthlyRevenue: 842500,
  ytdRevenue: 4218500,
  totalLeaders: 18,
  activeLeaders: 14,
  openTickets: 7,
  totalClients: 389,
  avgRating: 4.7,
  completedThisMonth: 89,
  newClientsThisMonth: 34,
  completionRate: 94,
  pendingBookings: 5,
};

export const MOCK_REVENUE_CHART = [
  { month: 'Jan', revenue: 512000 },
  { month: 'Feb', revenue: 638000 },
  { month: 'Mar', revenue: 701000 },
  { month: 'Apr', revenue: 589000 },
  { month: 'May', revenue: 824000 },
  { month: 'Jun', revenue: 842500 },
];

export const MOCK_BOOKING_CHART = [
  { month: 'Jan', count: 67 },
  { month: 'Feb', count: 82 },
  { month: 'Mar', count: 91 },
  { month: 'Apr', count: 78 },
  { month: 'May', count: 104 },
  { month: 'Jun', count: 89 },
];

export const MOCK_SERVICE_DISTRIBUTION = [
  { name: 'Elder Care',         count: 423, color: '#3b82f6' },
  { name: 'Home Nursing',       count: 287, color: '#14b8a6' },
  { name: 'Physiotherapy',      count: 198, color: '#f97316' },
  { name: 'Patient Caretaker',  count: 176, color: '#8b5cf6' },
  { name: 'Post-Surgery Care',  count: 108, color: '#f43f5e' },
  { name: 'Medical Assistance', count: 55,  color: '#22c55e' },
];

export const MOCK_ALL_BOOKINGS = [
  {
    id: 'AO847302', service: 'Elder Care', status: 'ACTIVE',
    client: { name: 'Arjun Shukla', phone: '+91 98765 43210', email: 'arjun@example.com' },
    patient: 'Shyam Lal Shukla', startDate: 'Jun 10, 2026', endDate: 'Jul 10, 2026',
    leader: { id: 'L001', name: 'Priya Desai' },
    amount: 21600, createdAt: 'Jun 09, 2026',
  },
  {
    id: 'AO738491', service: 'Physiotherapy', status: 'PENDING',
    client: { name: 'Meera Patel', phone: '+91 87654 32109', email: 'meera@example.com' },
    patient: 'Rajan Patel', startDate: 'Jun 25, 2026', endDate: 'Jul 09, 2026',
    leader: null,
    amount: 21000, createdAt: 'Jun 18, 2026',
  },
  {
    id: 'AO621047', service: 'Home Nursing', status: 'COMPLETED',
    client: { name: 'Ramesh Sharma', phone: '+91 76543 21098', email: 'ramesh@example.com' },
    patient: 'Sunita Sharma', startDate: 'May 01, 2026', endDate: 'May 08, 2026',
    leader: { id: 'L001', name: 'Priya Desai' },
    amount: 8400, createdAt: 'Apr 30, 2026',
  },
  {
    id: 'AO519382', service: 'Post-Surgery Care', status: 'CANCELLED',
    client: { name: 'Kavita Nair', phone: '+91 65432 10987', email: 'kavita@example.com' },
    patient: 'Suresh Nair', startDate: 'Apr 15, 2026', endDate: 'Apr 18, 2026',
    leader: null,
    amount: 3300, createdAt: 'Apr 12, 2026',
  },
  {
    id: 'AO412093', service: 'Elder Care', status: 'PENDING',
    client: { name: 'Deepak Mehta', phone: '+91 54321 09876', email: 'deepak@example.com' },
    patient: 'Lata Mehta', startDate: 'Jun 22, 2026', endDate: 'Jul 22, 2026',
    leader: null,
    amount: 24000, createdAt: 'Jun 19, 2026',
  },
  {
    id: 'AO398271', service: 'Medical Assistance', status: 'PENDING',
    client: { name: 'Sunita Verma', phone: '+91 43210 98765', email: 'sunita@example.com' },
    patient: 'Ram Verma', startDate: 'Jun 23, 2026', endDate: 'Jun 30, 2026',
    leader: null,
    amount: 6300, createdAt: 'Jun 19, 2026',
  },
  {
    id: 'AO376510', service: 'Patient Caretaker', status: 'ACTIVE',
    client: { name: 'Priti Singh', phone: '+91 32109 87654', email: 'priti@example.com' },
    patient: 'Mohan Singh', startDate: 'Jun 12, 2026', endDate: 'Jun 26, 2026',
    leader: { id: 'L002', name: 'Anjali Sharma' },
    amount: 9800, createdAt: 'Jun 11, 2026',
  },
];

export const MOCK_LEADERS = [
  {
    id: 'L001', name: 'Priya Desai', email: 'priya.desai@angelsone.com', phone: '+91 98765 12345',
    specializations: ['Elder Care', 'Home Nursing', 'Post-Surgery Care'],
    experience: '5 years', rating: 4.8, completedBookings: 127,
    activeBookings: 1, status: 'ACTIVE', joinedDate: 'Mar 2021', location: 'Mumbai',
    onTimePercent: 97,
  },
  {
    id: 'L002', name: 'Anjali Sharma', email: 'anjali.sharma@angelsone.com', phone: '+91 87654 09876',
    specializations: ['Patient Caretaker', 'Elder Care'],
    experience: '7 years', rating: 4.9, completedBookings: 214,
    activeBookings: 1, status: 'ACTIVE', joinedDate: 'Jan 2020', location: 'Mumbai',
    onTimePercent: 99,
  },
  {
    id: 'L003', name: 'Sunita Rao', email: 'sunita.rao@angelsone.com', phone: '+91 76543 98765',
    specializations: ['Physiotherapy', 'Post-Surgery Care'],
    experience: '3 years', rating: 4.6, completedBookings: 68,
    activeBookings: 0, status: 'ACTIVE', joinedDate: 'Sep 2022', location: 'Pune',
    onTimePercent: 94,
  },
  {
    id: 'L004', name: 'Rekha Pillai', email: 'rekha.pillai@angelsone.com', phone: '+91 65432 87654',
    specializations: ['Home Nursing', 'Medical Assistance'],
    experience: '6 years', rating: 4.7, completedBookings: 156,
    activeBookings: 0, status: 'INACTIVE', joinedDate: 'Jun 2020', location: 'Mumbai',
    onTimePercent: 95,
  },
  {
    id: 'L005', name: 'Meena Joshi', email: 'meena.joshi@angelsone.com', phone: '+91 54321 76543',
    specializations: ['Elder Care', 'Patient Caretaker', 'Medical Assistance'],
    experience: '4 years', rating: 4.5, completedBookings: 89,
    activeBookings: 2, status: 'ACTIVE', joinedDate: 'Apr 2022', location: 'Thane',
    onTimePercent: 91,
  },
];

export const MOCK_ALL_TICKETS = [
  {
    id: 'TKT-001', bookingId: 'AO621047', clientName: 'Ramesh Sharma', service: 'Home Nursing',
    subject: 'Caregiver arrived late on Day 3', category: 'Service Issue',
    status: 'RESOLVED', priority: 'MEDIUM', assignedTo: 'Priya Desai', createdAt: 'May 03, 2026',
    messages: [
      { from: 'Client',  text: 'The caregiver arrived 45 minutes late on May 3rd without informing us.', at: 'May 03 — 10:30 AM' },
      { from: 'Leader',  text: 'I sincerely apologize. I encountered unexpected traffic.', at: 'May 03 — 11:00 AM' },
      { from: 'Support', text: 'Issue noted and resolved. Warning issued to leader.', at: 'May 03 — 2:00 PM' },
    ],
  },
  {
    id: 'TKT-002', bookingId: 'AO847302', clientName: 'Arjun Shukla', service: 'Elder Care',
    subject: 'Need to update patient medication list', category: 'Information Update',
    status: 'OPEN', priority: 'HIGH', assignedTo: 'Priya Desai', createdAt: 'Jun 15, 2026',
    messages: [
      { from: 'Client',  text: "My father has been prescribed Amlodipine 5mg. Please update the caregiver.", at: 'Jun 15 — 9:00 AM' },
      { from: 'Support', text: 'Forwarded to assigned leader for acknowledgement.', at: 'Jun 15 — 9:30 AM' },
    ],
  },
  {
    id: 'TKT-003', bookingId: 'AO376510', clientName: 'Priti Singh', service: 'Patient Caretaker',
    subject: 'Billing query — extra charges', category: 'Billing Query',
    status: 'OPEN', priority: 'LOW', assignedTo: null, createdAt: 'Jun 17, 2026',
    messages: [
      { from: 'Client', text: 'I was charged ₹200 extra. Please clarify what the additional charge is for.', at: 'Jun 17 — 3:00 PM' },
    ],
  },
  {
    id: 'TKT-004', bookingId: 'AO412093', clientName: 'Deepak Mehta', service: 'Elder Care',
    subject: 'Request to change shift from Morning to Evening', category: 'Service Change',
    status: 'IN_PROGRESS', priority: 'MEDIUM', assignedTo: 'Admin', createdAt: 'Jun 19, 2026',
    messages: [
      { from: 'Client',  text: 'We need to change the shift to Evening 4-8 PM due to a schedule change.', at: 'Jun 19 — 11:00 AM' },
      { from: 'Support', text: 'We are checking leader availability for the evening slot.', at: 'Jun 19 — 12:00 PM' },
    ],
  },
];

export const MOCK_ALL_REVIEWS = [
  {
    id: 'REV-001', bookingId: 'AO621047', clientName: 'Ramesh Sharma',
    service: 'Home Nursing', leader: 'Priya Desai', rating: 5,
    comment: 'Priya was exceptional — professional, punctual, and genuinely caring. My wife recovered beautifully.',
    date: 'May 09, 2026', status: 'APPROVED', featured: true,
  },
  {
    id: 'REV-002', bookingId: 'AO376510', clientName: 'Priti Singh',
    service: 'Patient Caretaker', leader: 'Anjali Sharma', rating: 4,
    comment: 'Very good service overall. Anjali was thorough and patient. Minor communication gap initially but resolved quickly.',
    date: 'Jun 14, 2026', status: 'APPROVED', featured: false,
  },
  {
    id: 'REV-003', bookingId: 'AO519382', clientName: 'Kavita Nair',
    service: 'Post-Surgery Care', leader: null, rating: 3,
    comment: 'Booking was cancelled last minute. Would have appreciated more notice. Support team was helpful though.',
    date: 'Apr 14, 2026', status: 'PENDING', featured: false,
  },
  {
    id: 'REV-004', bookingId: 'AO847302', clientName: 'Arjun Shukla',
    service: 'Elder Care', leader: 'Priya Desai', rating: 5,
    comment: 'Priya is wonderful with my father. He has warmed up to her completely. Highly recommend Angels One.',
    date: 'Jun 18, 2026', status: 'PENDING', featured: false,
  },
];

export const MOCK_RECENT_ACTIVITY = [
  { id: 1, type: 'booking',  text: 'New booking received — AO398271 (Medical Assistance)',    time: '2 min ago',  color: 'blue' },
  { id: 2, type: 'leader',   text: 'Leader assigned — Priya Desai → AO847302 (Elder Care)',   time: '18 min ago', color: 'teal' },
  { id: 3, type: 'ticket',   text: 'New ticket opened — TKT-004 by Deepak Mehta',             time: '1 hr ago',   color: 'amber' },
  { id: 4, type: 'review',   text: 'New 5★ review submitted — Elder Care (Arjun Shukla)',     time: '2 hrs ago',  color: 'rose' },
  { id: 5, type: 'complete', text: 'Service completed & OTP verified — AO621047 Home Nursing', time: '3 hrs ago',  color: 'green' },
  { id: 6, type: 'booking',  text: 'New booking received — AO412093 (Elder Care)',             time: '4 hrs ago',  color: 'blue' },
];
