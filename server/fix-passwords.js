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

const userSchema = new mongoose.Schema({
  email:    { type: String, lowercase: true, trim: true },
  password: { type: String, select: false },
  role:     { type: String },
});
const User = mongoose.model('User', userSchema);

const TEST_PASSWORD = 'Test@1234';
const EMAILS = [
  'testclient@angelsone.dev',
  'testleader@angelsone.dev',
  'testadmin@angelsone.dev',
];

const run = async () => {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  console.log('Connected to MongoDB\n');

  const hash = await bcrypt.hash(TEST_PASSWORD, 12);

  for (const email of EMAILS) {
    const result = await User.updateOne(
      { email },
      { $set: { password: hash, authProvider: 'local', isActive: true } }
    );
    if (result.matchedCount === 0) {
      console.log(`NOT FOUND: ${email}`);
    } else {
      console.log(`UPDATED:   ${email}`);
    }
  }

  console.log(`\nPassword set to: ${TEST_PASSWORD} for all accounts above`);
  await mongoose.disconnect();
};

run().catch((err) => { console.error(err.message); process.exit(1); });
