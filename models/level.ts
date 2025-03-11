import mongoose from "mongoose";

export interface ILevel {
  levelName: string;

  level: number;
  /**
   * Script to be run to setup a level, including pulling/building of images
   */
  preload: string[];
  /**
   * Should contain just one line, the command to enter the container
   */
  run: string[];
  /**
   * Cleanup script to clean stop and clean containers for this level
   */
  cleanup: string[];
  /**
   * The FLAG
   */
  flag: string;

  /**
   * The score
   */
  score: number;
}

/**
 * Level Schema
 */
const levelSchema = new mongoose.Schema<ILevel>({
  levelName: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  preload: {
    type: [String],
    required: true,
  },
  run: {
    type: [String],
    required: true,
  },
  cleanup: {
    type: [String],
    required: true,
  },
  flag: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});
const Level = mongoose.model<ILevel>("level", levelSchema);

export default Level;
