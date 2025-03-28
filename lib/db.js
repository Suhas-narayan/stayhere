import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGO_URI);
};
