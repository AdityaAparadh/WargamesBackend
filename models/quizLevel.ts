import mongoose from "mongoose";

export interface IQuizLevel {
  level: number;

  question: string;

  options: string[];

  answer: number;

  score: number;
}

/**
 * Quiz Level Schema
 */
const levelSchema = new mongoose.Schema<IQuizLevel>({
  level: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  answer: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});
const quizLevel = mongoose.model<IQuizLevel>("quizLevel", levelSchema);

export default quizLevel;
