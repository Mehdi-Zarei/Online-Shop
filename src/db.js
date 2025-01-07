const mongoose = require("mongoose");
const configs = require("../configs");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(configs.DB.uri);
    console.log(
      `✅ Connected to MongoDB successfully on : ${mongoose.connection.host}.`
    );
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

connectToDatabase();

module.exports = mongoose;
