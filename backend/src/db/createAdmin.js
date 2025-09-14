import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/admin.model.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);

    const admin = new Admin({
      name: "Arpit",
      email: "arpit@gmail.com",
      password: "arpit",  // Plain password; will get hashed
      institution: "BPIT",
    });

    await admin.save();
    console.log("Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
