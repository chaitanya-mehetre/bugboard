require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

const seedAdmin = async () => {
  await connectDB();

  const email = 'admin@bugboard.com';
  const existing = await User.findOne({ email });

  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.create({
    fullName: 'Admin',
    email,
    password: hashedPassword,
    role: 'Admin',
  });

  console.log('Admin created: admin@bugboard.com / admin123');
  process.exit(0);
};

seedAdmin();