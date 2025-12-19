import mongoose from "mongoose";

export const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MongoDb_url);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB error:", error.message);
  }
};
