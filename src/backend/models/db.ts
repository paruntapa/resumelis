import mongoose from "mongoose";
import dotenv from "dotenv";
import JobListing from "./JobListing ";
dotenv.config();

const connectDB = async () => {
  const mongoDB: string = process.env.mongodb || "";
  try {
    await mongoose.connect(mongoDB);
    console.log("Connected to MongoDB");
    await JobListing.syncIndexes();
    console.log("Indexes synced successfully for JobListing collection");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
