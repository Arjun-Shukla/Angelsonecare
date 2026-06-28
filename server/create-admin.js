import dns from 'dns';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('MONGO_URI not set'); process.exit(1); }

// ── Change these to your desired admin credentials ────────────────────────────
const ADMIN_NAME     = 'Admin';
const ADMIN_EMAIL    = 'admin@angelsonecare.in';
const ADMIN_PASSWORD = 'Admin@1234';
// ─────────────────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  name:         { type: String, trim: true },
  email:        { type: String, lowercase: true, trim: true },
  phone:        { type: String, default: '' },
  password:     { type: String },
  role:         { type: String, default: 'CLIENT' },
  authProvider: { type: String, default: 'local' },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const run = async () => {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  console.log('Connected to MongoDB\n');

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    // Update role and password if account already exists
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.updateOne({ email: ADMIN_EMAIL }, { $set: { role: 'ADMIN', password: hash, isActive: true } });
    console.log(`Updated existing account → role set to ADMIN`);
  } else {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hash,
      role: 'ADMIN',
      authProvider: 'local',
    });
    console.log(`Admin account created`);
  }

  console.log(`\nAdmin credentials:`);
  console.log(`  Email    : ${ADMIN_EMAIL}`);
  console.log(`  Password : ${ADMIN_PASSWORD}`);

  await mongoose.disconnect();
};

run().catch((err) => { console.error(err.message); process.exit(1); });
