const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow', {
      serverSelectionTimeoutMS: 3000 // Quick timeout if local mongo isn't running
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}`);
    console.warn(`Running backend with in-memory fallback store mode. Real MongoDB instance can be connected anytime at MONGODB_URI environment variable.`);
    return false;
  }
};

module.exports = connectDB;
