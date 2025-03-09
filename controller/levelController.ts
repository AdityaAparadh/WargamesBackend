import type { Request, Response } from "express";
import User from "../models/user";
import Level, { type ILevel } from "../models/level";
import quizLevel from "../models/quizLevel";
import leaderboardItem from "../models/leaderboardItem";

/**
 * Controller to return scripts to setup, run and cleanup level
 */
const getLevel = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ username: req.body.username });
    if (!currentUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const level = currentUser.currentLevel;
    const findLevel = (await Level.findOne({ level })) as ILevel;

    if (!findLevel) {
      return res.status(404).send({ message: "Level not found" });
    }
    return res.status(200).send({
      preload: findLevel.preload,
      run: findLevel.run,
      cleanup: findLevel.cleanup,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getQuizLevel = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ username: req.body.username });
    if (!currentUser) {
      return res.status(404).send({ message: "User not found" });
    }

    const level = currentUser.currentQuizLevel;
    const findLevel = await quizLevel.findOne({ level });

    if (!findLevel) {
      return res.status(404).send({ message: "Level not found" });
    }
    return res.status(200).send({
      question: findLevel.question,
      options: findLevel.options,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

/**
 * Flag submission controller
 */
const submitFlag = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ username: req.body.username });
    if (!currentUser) {
      return res.status(404).send({ message: "User not found" });
    }

    if (!req.body.flag) {
      return res.status(400).send({ message: "Flag not provided" });
    }

    const currentLevel = currentUser.currentLevel;
    const findLevel = await Level.findOne({ level: currentLevel });
    if (!findLevel) {
      return res.status(404).send({ message: "Level not found" });
    }

    if (findLevel.flag == req.body.flag) {
      currentUser.currentLevel = currentLevel + 1;
      currentUser.lastSubmission = new Date();
      await currentUser.save();
      return res.status(200).send({
        message: "Correct Flag. Yay!",
      });
    } else {
      return res.status(401).send({ message: "Incorrect Flag" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const submitQuiz = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ username: req.body.username });
    if (!currentUser) {
      return res.status(404).send({ message: "User not found" });
    }
    if (!req.body.answer) {
      return res.status(400).send({ message: "No answer submitted" });
    }

    const findQuizLevel = await quizLevel.findOne({
      level: currentUser.currentQuizLevel,
    });

    currentUser.currentQuizLevel += 1;
    currentUser.lastSubmission = new Date();

    if (findQuizLevel?.answer == req.body.answer) {
      currentUser.lastSubmission = new Date();
      currentUser.correctQuizLevels.push(currentUser.currentQuizLevel - 1);
      await currentUser.save();
      return res.status(200).send({
        message: "Correct Answer. Yay!",
      });
    } else {
      await currentUser.save();
      return res.status(400).send({ message: "Incorrect Answer" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const generateLeaderboard = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    const levels = await Level.find({});
    const quizLevels = await quizLevel.find({});

    await Promise.all(
      users.map(async (user) => {
        let totalScore = 0;

        for (const level of user.correctQuizLevels) {
          const quizLevel = quizLevels.find((quizLevel) => quizLevel.level === level);
          if (quizLevel) {
            totalScore += quizLevel.score;
          }
        }

        for (let i = 0; i < user.currentLevel - 1; i++) {
          const level = levels[i];
          if (level) {
            totalScore += level.score;
          }
        }

        const item = await leaderboardItem.findOneAndUpdate(
          { username: user.username },
          { username: user.username, score: totalScore, lastSubmission: user.lastSubmission },
          { new: true, upsert: true }
        );

        return item;
      })
    );

    return res.status(200).send({ message: "Leaderboard updated successfully"});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};



export { getLevel, getQuizLevel, submitFlag, submitQuiz, generateLeaderboard };
