import mongoose from "mongoose";

interface IUser {
  username: string;
  password: string;
  currentLevel: number;
  lastSubmission: Date;
}

/**
 * Participant Schema
 */
const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  currentLevel: {
    type: Number,
    required: true,
  },
  lastSubmission: {
    type: Date,
    required: true,
  },
});
const User = mongoose.model<IUser>("user", userSchema);

export default User;
