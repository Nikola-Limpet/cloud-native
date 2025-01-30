require('dotenv').config();
const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = dbConnect;