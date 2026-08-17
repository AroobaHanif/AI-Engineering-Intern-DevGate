require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const emailToPromote = process.argv[2];

if (!emailToPromote) {
  console.log('Usage: node makeAdmin.js someone@gmail.com');
  process.exit(1);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB!');

  const user = await User.findOneAndUpdate(
    { username: emailToPromote },
    { role: 'admin' },
    { new: true }
  );

  if (!user) {
    console.log(`No user found with email: ${emailToPromote}`);
  } else {
    console.log(`✅ ${user.username} is now an admin!`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run();