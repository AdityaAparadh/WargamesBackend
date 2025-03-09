import leaderboardItem from "../models/leaderboardItem";
// import Level, { type ILevel } from "../models/level";
// import type { IQuizLevel } from "../models/quizLevel";
// import quizLevel from "../models/quizLevel";
import Setting from "../models/setting";
import User from "../models/user";
import type { Request, Response } from "express";

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const findHidden = await Setting.findOne({ key: "hideLeaderboard" });
    if (!findHidden) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
    const hidden: boolean = findHidden.value == "true" ? true : false;

    const leaderboardItems = await leaderboardItem.find();



    // const sortedLeaderboard = leaderboard.sort((a, b) => {
    //   if (b.score !== a.score) {
    //     return b.score - a.score;
    //   }
    //   return (
    //     new Date(a.lastSubmission).getTime() -
    //     new Date(b.lastSubmission).getTime()
    //   );
    // });

    const sortedLeaderboard = leaderboardItems.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (
        new Date(a.lastSubmission).getTime() -
        new Date(b.lastSubmission).getTime()
      );

    });


    if (hidden && sortedLeaderboard.length >= 5) {
      sortedLeaderboard.splice(0, 5);
    } else if (hidden) {
      sortedLeaderboard.splice(0, sortedLeaderboard.length);
    }

    return res.status(200).send({ hidden, data: sortedLeaderboard });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getStatus = async (req: Request, res: Response) => {
  try {
    const findHidden = await Setting.findOne({ key: "hideLeaderboard" });
    if (!findHidden) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
    const hidden: boolean = findHidden.value == "true" ? true : false;


    const users = await User.find().sort({
      currentLevel: -1,
      lastSubmission: 1,
    });

    const leaderboardItems = await leaderboardItem.find();


    const sortedLeaderboard = leaderboardItems.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (
        new Date(a.lastSubmission).getTime() -
        new Date(b.lastSubmission).getTime()
      );

    });


    let rank =
      sortedLeaderboard.findIndex(
        (user) => user.username === req.body.username,
      ) + 1;
    if (hidden && rank <= 5) {
      rank = 0;
    }

    return res.status(200).send({
      score: sortedLeaderboard.find(
        (user) => user.username === req.body.username,
      )?.score,
      rank,
      currentdockerLevel: users.find(
        (user) => user.username === req.body.username,
      )?.currentLevel,
      currentkubesLevel: users.find(
        (user) => user.username === req.body.username,
      )?.currentQuizLevel,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
