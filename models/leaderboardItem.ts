import mongoose from "mongoose";

export interface ILeaderboardItem {
    username: string;
    score: number;
    lastSubmission: Date;
}

/**
 * Leaderboard Item Schema
 */
const leaderboardItemSchema = new mongoose.Schema<ILeaderboardItem>({
    username: {
        type: String,
        required: true,
    },
  score: {
    type: Number,
    required: true,
  },
  lastSubmission: {
    type: Date,
    required: true,
  },
});
const leaderboardItem = mongoose.model<ILeaderboardItem>("leaderboardItem", leaderboardItemSchema);

export default leaderboardItem;
