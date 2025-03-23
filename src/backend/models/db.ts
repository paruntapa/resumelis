import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  const mongoDB: string = process.env.mongodb || "";
  try {
    await mongoose.connect(mongoDB);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
