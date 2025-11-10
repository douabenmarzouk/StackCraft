import mongoose from "mongoose";

export const connectDB = async () => {
  try { 
    if (!process.env.MONGO_URL) { 
      throw new Error("Mongo URL is not defined in .env");
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connecté avec succès !");
  }
  catch (error) {
    console.error("Cannot connect to MongoDB:", error.message);
    process.exit(1);
  }
};