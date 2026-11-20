import bcrypt from 'bcryptjs';
import { dbManager } from '../data/dbManager.js';

const args = process.argv.slice(2);
const username = args[0] || process.env.ADMIN_USERNAME || 'admin';
const password = args[1] || 'Admin@gpt111';

console.log(`🔐 Seeding Admin account...`);
console.log(`   Username: ${username}`);
console.log(`   Password: ${password}`);

const hash = bcrypt.hashSync(password, 10);
const db = dbManager.read();

db.admin = {
  username,
  passwordHash: hash,
  role: 'SUPER_ADMIN',
  updatedAt: new Date().toISOString()
};

dbManager.write(db);

console.log(`✅ Admin account created successfully! You can now log in at /admin with these credentials.`);
