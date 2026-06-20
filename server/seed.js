/**
 * Dev seed script — creates three test accounts (CLIENT, LEADER, ADMIN).
 * Safe to run multiple times: skips any email that already exists.
 *
 * Usage (from the server/ directory):
 *   node seed.js
 */

import dns from 'dns';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

dns.setServers(['8.8.8.8', '1.1.1.1']);

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌  MONGO_URI is not set in server/.env');
  process.exit(1);
}

// ── Inline User schema (mirrors models/User.js) ───────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:          { type: String, default: '' },
    password:       { type: String, select: false },
    profilePicture: { type: String, default: '' },
    googleId:       { type: String, unique: true, sparse: true },
    role:           { type: String, enum: ['CLIENT', 'LEADER', 'ADMIN'], default: 'CLIENT' },
    authProvider:   { type: String, enum: ['google', 'local'], default: 'local' },
    isActive:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

// ── Test accounts ─────────────────────────────────────────────────────────────
const TEST_PASSWORD = 'Test@1234';

const accounts = [
  {
    name:  'Test Client',
    email: 'testclient@angelsone.dev',
    phone: '9000000001',
    role:  'CLIENT',
  },
  {
    name:  'Test Leader',
    email: 'testleader@angelsone.dev',
    phone: '9000000002',
    role:  'LEADER',
  },
  {
    name:  'Test Admin',
    email: 'testadmin@angelsone.dev',
    phone: '9000000003',
    role:  'ADMIN',
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────
const seed = async () => {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  console.log('✅  Connected to MongoDB\n');

  const hash = await bcrypt.hash(TEST_PASSWORD, 12);

  for (const account of accounts) {
    const existing = await User.findOne({ email: account.email });
    if (existing) {
      console.log(`⏭️   ${account.role.padEnd(6)}  ${account.email}  (already exists — skipped)`);
      continue;
    }

    await User.create({ ...account, password: hash, authProvider: 'local' });
    console.log(`✅  ${account.role.padEnd(6)}  ${account.email}  created`);
  }

  console.log('\n─────────────────────────────────────────────');
  console.log('  Test credentials (all accounts):');
  console.log(`  Password : ${TEST_PASSWORD}`);
  console.log('─────────────────────────────────────────────');
  console.log('  CLIENT  →  testclient@angelsone.dev');
  console.log('  LEADER  →  testleader@angelsone.dev');
  console.log('  ADMIN   →  testadmin@angelsone.dev');
  console.log('─────────────────────────────────────────────\n');

  await mongoose.disconnect();
  console.log('Done.');
};

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
