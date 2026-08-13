const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  createdAt: Date
});

const User = mongoose.model('User', UserSchema);

async function checkUsers() {
  const uri = process.env.MONGODB_URI;
  console.log('Connecting to MongoDB Atlas...');
  console.log('URI:', uri ? uri.replace(/:([^@]+)@/, ':****@') : 'Not defined');

  if (!uri || uri.includes('*****')) {
    console.error('\n❌ ERROR: Your password in .env is still set to "*****". Please update server/.env with your real MongoDB database password first.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Atlas successfully!\n');

    const users = await User.find().select('-password');
    console.log(`Found ${users.length} registered user(s) in "taskflow.users":\n`);
    
    if (users.length === 0) {
      console.log('No users found in database yet. Register a new user on http://localhost:3000/ to populate users.');
    } else {
      users.forEach((user, idx) => {
        console.log(`${idx + 1}. Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Created At: ${user.createdAt || 'N/A'}`);
        console.log('---');
      });
    }
  } catch (error) {
    console.error('❌ Connection or query error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkUsers();
