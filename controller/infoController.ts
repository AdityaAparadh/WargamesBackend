import Level, { type ILevel } from "../models/level";
import type { IQuizLevel } from "../models/quizLevel";
import quizLevel from "../models/quizLevel";
import User from "../models/user";
import type { Request, Response } from "express";

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const allLevels: ILevel[] = await Level.find();
    const allQuizLevels: IQuizLevel[] = await quizLevel.find();

    if (!allLevels) {
      return res.status(404).send({ message: "Levels not found" });
    }

    const users = await User.find().sort({
      currentLevel: -1,
      lastSubmission: 1,
    });

    const leaderboard = users.map((user) => {
      const regularLevelScore = allLevels
        .filter((lvl) => lvl.level < user.currentLevel)
        .reduce((sum, lvl) => sum + lvl.score, 0);
      const quizLevelScore = allQuizLevels
        ? allQuizLevels
            .filter((lvl) => lvl.level < user.currentQuizLevel)
            .reduce((sum, lvl) => sum + lvl.score, 0)
        : 0;
      const totalScore = regularLevelScore + quizLevelScore;

      return {
        username: user.username,
        lastSubmission: user.lastSubmission,
        score: totalScore,
      };
    });

    const sortedLeaderboard = leaderboard.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (
        new Date(a.lastSubmission).getTime() -
        new Date(b.lastSubmission).getTime()
      );
    });

    return res.status(200).send(sortedLeaderboard);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
