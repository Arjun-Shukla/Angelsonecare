export const MOCK_USER = {
  _id: 'mock-001',
  name: 'Arjun Shukla',
  email: 'arjunshukla489@gmail.com',
  phone: '9876543210',
  role: 'CLIENT',
  avatar: null,
  createdAt: '2024-01-15T10:00:00.000Z',
  address: {
    line1: 'Flat 402, Skyline Residency',
    area: 'Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400068',
  },
};

export const MOCK_BOOKINGS = [
  {
    id: 'AO847302', service: 'Elder Care', status: 'ACTIVE',
    patient: 'Shyam Lal Shukla', relationship: 'Parent',
    duration: '1 Month', shift: 'Morning', shiftTime: '6 AM – 2 PM',
    startDate: '2026-06-10', endDate: '2026-07-10', timeSlot: '8:00 AM',
    address: 'Flat 402, Skyline Residency, Andheri West, Mumbai - 400068',
    leader: { name: 'Priya Desai', phone: '+91 98765 12345', experience: '5 years', rating: 4.8 },
    basePrice: 800, days: 30, total: 21600,
    extras: ['Medicine Assistance', 'Wheelchair Support'],
    notes: 'Patient has mild hypertension. Please monitor BP daily.',
    timeline: [
      { date: 'Jun 09, 2026', event: 'Booking Confirmed', done: true },
      { date: 'Jun 09, 2026', event: 'Caregiver Assigned', done: true },
      { date: 'Jun 10, 2026', event: 'Service Started', done: true },
      { date: 'Jul 10, 2026', event: 'Service Completion', done: false },
    ],
    serviceColor: 'blue',
    svgPath: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
  },
  {
    id: 'AO738491', service: 'Physiotherapy', status: 'PENDING',
    patient: 'Meera Shukla', relationship: 'Spouse',
    duration: '2 Weeks', shift: 'Evening', shiftTime: '4 PM – 8 PM',
    startDate: '2026-06-25', endDate: '2026-07-09', timeSlot: '5:00 PM',
    address: 'Flat 402, Skyline Residency, Andheri West, Mumbai - 400068',
    leader: null, basePrice: 1500, days: 14, total: 21000,
    extras: ['Physiotherapy Support'], notes: '',
    timeline: [
      { date: 'Jun 18, 2026', event: 'Booking Submitted', done: true },
      { date: 'Jun 18, 2026', event: 'Under Review', done: true },
      { date: 'Jun 19, 2026', event: 'Caregiver Assignment Pending', done: false },
      { date: 'Jun 25, 2026', event: 'Service Start', done: false },
    ],
    serviceColor: 'orange',
    svgPath: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z',
  },
  {
    id: 'AO621047', service: 'Home Nursing', status: 'COMPLETED',
    patient: 'Shyam Lal Shukla', relationship: 'Parent',
    duration: '1 Week', shift: '24 Hours', shiftTime: 'Full Day',
    startDate: '2026-05-01', endDate: '2026-05-08', timeSlot: '9:00 AM',
    address: 'Flat 402, Skyline Residency, Andheri West, Mumbai - 400068',
    leader: { name: 'Anjali Sharma', phone: '+91 87654 09876', experience: '7 years', rating: 4.9 },
    basePrice: 1200, days: 7, total: 8400,
    extras: ['Bedridden Patient', 'Medicine Assistance'], notes: 'Post knee surgery recovery care.',
    timeline: [
      { date: 'Apr 30, 2026', event: 'Booking Confirmed', done: true },
      { date: 'Apr 30, 2026', event: 'Caregiver Assigned', done: true },
      { date: 'May 01, 2026', event: 'Service Started', done: true },
      { date: 'May 08, 2026', event: 'Service Completed', done: true },
    ],
    review: { rating: 5, comment: 'Excellent service! Anjali was professional and caring. My father recovered well.', date: 'May 09, 2026' },
    serviceColor: 'teal',
    svgPath: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z',
  },
  {
    id: 'AO519382', service: 'Post-Surgery Care', status: 'CANCELLED',
    patient: 'Meera Shukla', relationship: 'Spouse',
    duration: '3 Days', shift: 'Morning', shiftTime: '6 AM – 2 PM',
    startDate: '2026-04-15', endDate: '2026-04-18', timeSlot: '7:00 AM',
    address: 'Flat 402, Skyline Residency, Andheri West, Mumbai - 400068',
    leader: null, basePrice: 1100, days: 3, total: 3300,
    extras: [], notes: '',
    timeline: [
      { date: 'Apr 12, 2026', event: 'Booking Submitted', done: true },
      { date: 'Apr 13, 2026', event: 'Cancelled by User', done: true },
    ],
    serviceColor: 'rose',
    svgPath: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
  },
];

export const MOCK_TICKETS = [
  {
    id: 'TKT-001', bookingId: 'AO621047', service: 'Home Nursing',
    subject: 'Caregiver arrived late on Day 3', category: 'Service Issue',
    description: 'The caregiver was 45 minutes late on May 3rd morning without prior notification.',
    status: 'RESOLVED', priority: 'MEDIUM', createdAt: 'May 03, 2026',
    messages: [
      { from: 'User', text: 'The caregiver arrived 45 minutes late on 3rd May without informing us. This is unacceptable.', at: 'May 03, 2026 — 10:30 AM' },
      { from: 'Support', text: 'We sincerely apologize for the inconvenience. We have spoken with the caregiver and issued a formal warning. This will not happen again.', at: 'May 03, 2026 — 2:00 PM' },
      { from: 'User', text: 'Thank you for resolving this quickly.', at: 'May 03, 2026 — 3:00 PM' },
    ],
  },
  {
    id: 'TKT-002', bookingId: 'AO847302', service: 'Elder Care',
    subject: 'Need to update patient medication list', category: 'Information Update',
    description: 'The patient has been prescribed a new medication (Amlodipine 5mg). Need to update caregiver.',
    status: 'OPEN', priority: 'HIGH', createdAt: 'Jun 15, 2026',
    messages: [
      { from: 'User', text: "My father has been prescribed Amlodipine 5mg starting today. Please update the caregiver's medication list immediately.", at: 'Jun 15, 2026 — 9:00 AM' },
    ],
  },
];

export const MOCK_REVIEWS = [
  {
    id: 'REV-001', bookingId: 'AO621047', service: 'Home Nursing', leader: 'Anjali Sharma',
    rating: 5,
    comment: 'Anjali was absolutely wonderful — professional, punctual, and genuinely caring. My father responded very well to her care. Highly recommend Angels One.',
    date: 'May 09, 2026',
  },
];
