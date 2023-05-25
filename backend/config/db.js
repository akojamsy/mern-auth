import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error - ${error.message}`);
    process.exit(1);
  }
};

export default dbConnection;
