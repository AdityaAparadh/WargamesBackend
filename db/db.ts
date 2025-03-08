import mongoose from "mongoose";
import config from "../config/config";

const db = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Database connected successfully");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default db;
