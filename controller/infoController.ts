import Level, { type ILevel } from "../models/level";
import User from "../models/user";
import type { Request, Response } from "express";

const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const allLevels: ILevel[] = await Level.find();
    if (!allLevels) {
      return res.status(404).send({ message: "Levels not found" });
    }

    const users = await User.find().sort({
      currentLevel: -1,
      lastSubmission: 1,
    });

    const leaderboard = users.map((user) => {
      return {
        username: user.username,
        currentLevel: user.currentLevel,
        lastSubmission: user.lastSubmission,
        score: allLevels
          .filter((lvl) => lvl.level < user.currentLevel)
          .reduce((sum, lvl) => sum + lvl.score, 0),
      };
    });

    return res.status(200).send(leaderboard);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
